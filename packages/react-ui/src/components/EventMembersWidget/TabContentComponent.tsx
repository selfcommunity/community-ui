import {Button, List, ListItem, styled, Typography} from '@mui/material';
import {Endpoints, http, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCEventType, SCUserType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import {AxiosResponse} from 'axios';
import {useSnackbar} from 'notistack';
import PubSub from 'pubsub-js';
import {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import InfiniteScroll from '../../shared/InfiniteScroll';
import {actionWidgetTypes} from '../../utils/widget';
import AcceptRequestUserEventButton from '../AcceptRequestUserEventButton';
import EventInviteButton from '../EventInviteButton';
import InviteUserEventButton from '../InviteUserEventButton';
import User, {UserProps, UserSkeleton} from '../User';
import {PREFIX} from './constants';
import {TabContentEnum, TabContentType} from './types';

const classes = {
  actionButton: `${PREFIX}-action-button`,
  eventButton: `${PREFIX}-event-button`,
  dialogRoot: `${PREFIX}-dialog-root`,
  infiniteScroll: `${PREFIX}-infinite-scroll`,
  endMessage: `${PREFIX}-end-message`
};

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot',
  overridesResolver: (_props, styles) => styles.dialogRoot
})(() => ({}));

interface TabComponentProps {
  tabValue: TabContentType;

  state: any;

  dispatch: Dispatch<any>;

  /**
   * Props to spread to single user object
   * @default empty object
   */
  userProps?: UserProps;

  /**
   * Props to spread to users suggestion dialog
   * @default {}
   */
  dialogProps?: BaseDialogProps;

  actionProps?: {
    scEvent?: SCEventType;
    count?: number;
    setCount?: Dispatch<SetStateAction<number>>;
    users?: SCUserType[];
    setUsers?: Dispatch<SetStateAction<SCUserType[]>>;
  };

  handleRefresh?: (tabValue: TabContentType) => void;
}

export default function TabContentComponent(props: TabComponentProps) {
  // PROPS
  const {tabValue, state, dispatch, userProps, dialogProps, actionProps, handleRefresh} = props;

  // STATE
  const [openDialog, setOpenDialog] = useState(false);

  // REFS
  const updatesInvited = useRef(null);
  const updatesParticipants = useRef(null);

  // HOOKS
  const {enqueueSnackbar} = useSnackbar();

  // CONSTS
  const users: SCUserType[] = useMemo(
    () => (tabValue === TabContentEnum.REQUESTS ? actionProps?.users : state.results),
    [tabValue, actionProps?.users, state.results]
  );

  // EFFECTS
  useEffect(() => {
    updatesInvited.current = PubSub.subscribe(`${SCTopicType.EVENT}.${SCGroupEventType.INVITE_MEMBER}`, handleInviteMember);
    updatesParticipants.current = PubSub.subscribe(`${SCTopicType.EVENT}.${SCGroupEventType.MEMBERS}`, handleToggleMember);

    return () => {
      updatesInvited.current && PubSub.unsubscribe(updatesInvited.current);
      updatesParticipants.current && PubSub.unsubscribe(updatesParticipants.current);
    };
  }, []);

  useEffect(() => {
    if (openDialog && state.next && state.initialized) {
      handleNext();
    }
  }, [openDialog, state.next, state.initialized]);

  // HANDLERS
  /**
   * Handles pagination
   */
  const handleNext = useCallback(() => {
    dispatch({type: actionWidgetTypes.LOADING_NEXT});

    http
      .request({
        url: state.next,
        method: Endpoints.UserSuggestion.method
      })
      .then((res: AxiosResponse<SCPaginatedResponse<SCUserType>>) => {
        dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }, [state.next, state.isLoadingNext, state.initialized, dispatch]);

  const handleToggleDialogOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
  }, [setOpenDialog]);

  const handleToggleMember = useCallback(() => {
    handleRefresh?.(TabContentEnum.PARTICIPANTS);
  }, [handleRefresh]);

  const handleInviteMember = useCallback(() => {
    handleRefresh?.(TabContentEnum.INVITED);
  }, [handleRefresh]);

  const getActionsComponent = useCallback(
    (userId: number) => {
      if (tabValue === TabContentEnum.INVITED && actionProps) {
        const _handleInvitations = (invited: boolean) => {
          if (invited) {
            actionProps.setCount?.((prev) => prev - 1);
          } else {
            actionProps.setCount?.((prev) => prev + 1);
          }
        };

        return <InviteUserEventButton event={actionProps.scEvent} userId={userId} handleInvitations={_handleInvitations} />;
      } else if (tabValue === TabContentEnum.REQUESTS && actionProps) {
        const handleConfirm = (id: number | null) => {
          if (id) {
            actionProps.setCount((prev) => prev - 1);
            actionProps.setUsers((prev) => prev.filter((user) => user.id !== id));

            enqueueSnackbar(
              <FormattedMessage
                id="ui.acceptRequestUserEventButton.snackbar.success"
                defaultMessage="ui.acceptRequestUserEventButton.snackbar.success"
              />,
              {
                variant: 'success',
                autoHideDuration: 3000
              }
            );
          } else {
            enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
              variant: 'error',
              autoHideDuration: 3000
            });
          }
        };

        return <AcceptRequestUserEventButton event={actionProps.scEvent} userId={userId} handleConfirm={handleConfirm} />;
      }

      return undefined;
    },
    [tabValue, actionProps]
  );

  if (tabValue === TabContentEnum.PARTICIPANTS && actionProps?.count === 0) {
    return (
      <Typography variant="body1">
        <FormattedMessage id="ui.eventMembersWidget.noParticipants" defaultMessage="ui.eventMembersWidget.noParticipants" />
      </Typography>
    );
  } else if (tabValue === TabContentEnum.INVITED && state.count === 0 && actionProps) {
    const date = actionProps.scEvent.end_date || actionProps.scEvent.start_date;
    const disabled = new Date(date).getTime() < new Date().getTime();

    const handleInvitations = (invited: boolean) => {
      if (invited) {
        handleRefresh?.(tabValue);
      }
    };

    return (
      <EventInviteButton event={actionProps.scEvent} className={classes.eventButton} handleInvitations={handleInvitations} disabled={disabled} />
    );
  } else if (tabValue === TabContentEnum.REQUESTS && actionProps?.count === 0) {
    return (
      <Typography variant="body1">
        <FormattedMessage id="ui.eventMembersWidget.noOtherRequests" defaultMessage="ui.eventMembersWidget.noOtherRequests" />
      </Typography>
    );
  }

  return (
    <>
      <List>
        {users?.slice(0, state.visibleItems).map((user: SCUserType) => (
          <ListItem key={user.id}>
            <User elevation={0} user={user} {...userProps} actions={getActionsComponent(user.id)} />
          </ListItem>
        ))}
      </List>

      {state.count > state.visibleItems && (
        <Button onClick={handleToggleDialogOpen} className={classes.actionButton}>
          <Typography variant="caption">
            <FormattedMessage id="ui.eventMembersWidget.showAll" defaultMessage="ui.eventMembersWidget.showAll" />
          </Typography>
        </Button>
      )}

      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={<FormattedMessage defaultMessage="ui.eventMembersWidget.title" id="ui.eventMembersWidget.title" />}
          onClose={handleToggleDialogOpen}
          open
          {...dialogProps}>
          <InfiniteScroll
            dataLength={state.results.length}
            next={handleNext}
            hasMoreNext={Boolean(state.next)}
            loaderNext={<UserSkeleton elevation={0} {...userProps} />}
            className={classes.infiniteScroll}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.eventMembersWidget.noMoreResults" defaultMessage="ui.eventMembersWidget.noMoreResults" />
              </Typography>
            }>
            <List>
              {state.results.map((user: SCUserType) => (
                <ListItem key={user.id}>
                  <User elevation={0} user={user} {...userProps} />
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogRoot>
      )}
    </>
  );
}
