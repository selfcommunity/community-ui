import {Avatar, AvatarGroup, Button, List, ListItem, Typography} from '@mui/material';
import {ButtonProps} from '@mui/material/Button/Button';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Endpoints, EventService, http, HttpResponse, SCPaginatedResponse} from '@selfcommunity/api-services';
import {useSCFetchEvent} from '@selfcommunity/react-core';
import {SCEventPrivacyType, SCEventSubscriptionStatusType, SCEventType, SCUserType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import classNames from 'classnames';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';
import {SCOPE_SC_UI} from '../../constants/Errors';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import InfiniteScroll from '../../shared/InfiniteScroll';
import {numberFormatter} from '../../utils/buttonCounters';
import AvatarGroupSkeleton from '../Skeleton/AvatarGroupSkeleton';
import User, {UserSkeleton} from '../User';

const PREFIX = 'SCEventParticipantsButton';

const classes = {
  root: `${PREFIX}-root`,
  participants: `${PREFIX}-participants`,
  dialogRoot: `${PREFIX}-dialog-root`,
  infiniteScroll: `${PREFIX}-infinite-scroll`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root,
  shouldForwardProp: (prop) => prop !== 'followers'
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot',
  overridesResolver: (_props, styles) => styles.dialogRoot
})(() => ({}));

export interface EventParticipantsButtonProps extends Pick<ButtonProps, Exclude<keyof ButtonProps, 'onClick' | 'disabled'>> {
  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;

  /**
   * EventId of event object
   * @default null
   */
  eventId?: number;

  /**
   * Hide button label
   * @default false
   */
  hideCaption?: boolean;

  /**
   * Props to spread to followedBy dialog
   * @default {}
   */
  DialogProps?: BaseDialogProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Event Participants Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {EventParticipantsButton} from '@selfcommunity/react-ui';
 ```
 #### Component Name

 The name `SCEventParticipantsButton` can be used when providing style overrides in the theme.

 * #### CSS
 *
 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventParticipantsButton-root|Styles applied to the root element.|
 |dialogRoot|.SCEventParticipantsButton-dialog-root|Styles applied to the root element.|
 |endMessage|.SCEventParticipantsButton-end-message|Styles applied to the end message element.|

 * @param inProps
 */
export default function EventParticipantsButton(inProps: EventParticipantsButtonProps) {
  // PROPS
  const props: EventParticipantsButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, eventId, event, hideCaption = false, DialogProps = {}, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string | null>(null);
  const [offset, setOffset] = useState<number | null>(null);
  const [followers, setFollowers] = useState<SCUserType[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // HOOKS
  const {scEvent} = useSCFetchEvent({id: eventId, event, autoSubscribe: false});
  const participantsAvailable = useMemo(
    () =>
      scEvent?.privacy === SCEventPrivacyType.PUBLIC ||
      [SCEventSubscriptionStatusType.SUBSCRIBED, SCEventSubscriptionStatusType.GOING, SCEventSubscriptionStatusType.NOT_GOING].indexOf(
        scEvent?.subscription_status
      ) > -1,
    [scEvent]
  );

  useDeepCompareEffectNoCheck(() => {
    setFollowers([]);
    setLoading(true);
  }, [scEvent]);

  // FETCH FIRST FOLLOWERS
  useDeepCompareEffectNoCheck(() => {
    if (!scEvent) {
      return;
    }

    if (!followers.length && participantsAvailable) {
      EventService.getUsersGoingToEvent(scEvent.id, {limit: 3}).then((res: SCPaginatedResponse<SCUserType>) => {
        setFollowers([...res.results]);
        setOffset(4);
        setLoading(false);
      });
    } else {
      setOffset(0);
    }
  }, [scEvent, participantsAvailable, followers]);

  useEffect(() => {
    if (open && offset !== null) {
      setLoading(true);
      EventService.getUsersGoingToEvent(scEvent.id, {offset, limit: 20}).then((res: SCPaginatedResponse<SCUserType>) => {
        setFollowers([...(offset === 0 ? [] : followers), ...res.results]);
        setNext(res.next);
        setLoading(false);
        setOffset(null);
      });
    }
  }, [open, followers, offset]);

  /**
   * Memoized fetchFollowers
   */
  const fetchFollowers = useCallback(() => {
    if (!next) {
      return;
    }
    http
      .request({
        url: next,
        method: Endpoints.GetUsersGoingToEvent.method
      })
      .then((res: HttpResponse<any>) => {
        setFollowers([...followers, ...res.data.results]);
        setNext(res.data.next);
      })
      .catch((error) => Logger.error(SCOPE_SC_UI, error))
      .then(() => setLoading(false));
  }, [followers, scEvent, next]);

  const renderSurplus = useCallback(() => numberFormatter(followers.length), [followers]);

  /**
   * Opens dialog votes
   */
  const handleToggleDialogOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
  }, [setOpenDialog]);

  return (
    <>
      <Root
        className={classNames(classes.root, className)}
        onClick={handleToggleDialogOpen}
        disabled={loading || !scEvent || scEvent.goings_counter === 0}
        // @ts-expect-error this is needed to use followers into SCEventParticipantsButton
        followers={followers}
        {...rest}>
        {!hideCaption && (
          <Typography className={classes.participants} variant="caption">
            <FormattedMessage defaultMessage="ui.eventParticipantsButton.participants" id="ui.eventParticipantsButton.participants" />
          </Typography>
        )}

        {!followers.length && (loading || !scEvent) ? (
          <AvatarGroupSkeleton {...rest} {...(!participantsAvailable && {skeletonsAnimation: false})} />
        ) : (
          <AvatarGroup total={followers.length} renderSurplus={renderSurplus}>
            {followers.map((c: SCUserType) => (
              <Avatar key={c.id} alt={c.username} src={c.avatar} />
            ))}
          </AvatarGroup>
        )}
      </Root>

      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={
            <FormattedMessage
              defaultMessage="ui.eventParticipantsButton.dialogTitle"
              id="ui.eventParticipantsButton.dialogTitle"
              values={{total: scEvent?.goings_counter || 0}}
            />
          }
          onClose={handleToggleDialogOpen}
          open
          {...DialogProps}>
          <InfiniteScroll
            dataLength={followers.length}
            next={fetchFollowers}
            hasMoreNext={next !== null || loading}
            loaderNext={<UserSkeleton elevation={0} />}
            className={classes.infiniteScroll}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage
                  id="ui.eventParticipantsButton.noOtherParticipants"
                  defaultMessage="ui.eventParticipantsButton.noOtherParticipants"
                />
              </Typography>
            }>
            <List>
              {followers.map((follower: SCUserType) => (
                <ListItem key={follower.id}>
                  <User elevation={0} user={follower} />
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogRoot>
      )}
    </>
  );
}
