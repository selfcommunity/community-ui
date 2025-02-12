import React, {useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import CommentNotification from './Comment';
import UserFollowNotification from './UserFollow';
import UndeletedForNotification from './UndeletedFor';
import DeletedForNotification from './DeletedFor';
import UserConnectionNotification from './UserConnection';
import PrivateMessageNotification from './PrivateMessage';
import UserBlockedNotification from './UserBlocked';
import MentionNotification from './Mention';
import CollapsedForNotification from './CollapsedFor';
import KindlyNoticeForNotification from './KindlyNoticeFor';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import KindlyNoticeFlagNotification from './KindlyNoticeFlag';
import VoteUpNotification from './VoteUp';
import EventNotification from './Event/Event';
import LiveStreamNotification from './LiveStream/LiveStream';
import Icon from '@mui/material/Icon';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {getContribution, getContributionRouteName, getContributionSnippet, getRouteData} from '../../utils/contribution';
import ContributionFollowNotification from './ContributionFollow';
import {Avatar, CardHeader, CardProps, Collapse, ListItemButton, ListItemText, Tooltip} from '@mui/material';
import IncubatorApprovedNotification from './IncubatorApproved';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import ContributionNotification from './Contribution';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';
import classNames from 'classnames';
import LoadingButton from '@mui/lab/LoadingButton';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import {Logger} from '@selfcommunity/utils';
import {
  SCCommentType,
  SCFeedObjectType,
  SCNotificationAggregatedType,
  SCNotificationGroupActivityType,
  SCNotificationPrivateMessageType,
  SCNotificationType,
  SCNotificationTypologyType
} from '@selfcommunity/types';
import UserDeletedSnackBar from '../../shared/UserDeletedSnackBar';
import UserAvatar from '../../shared/UserAvatar';
import {PREFIX} from './constants';
import GroupNotification from './Group';


const messages = defineMessages({
  receivePrivateMessage: {
    id: 'ui.notification.receivePrivateMessage',
    defaultMessage: 'ui.notification.receivePrivateMessage'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  avatar: `${PREFIX}-avatar`,
  title: `${PREFIX}-title`,
  image: `${PREFIX}-image`,
  username: `${PREFIX}-username`,
  content: `${PREFIX}-content`,
  unCollapsed: `${PREFIX}-uncollapsed`,
  collapsed: `${PREFIX}-collapsed`,
  stopButton: `${PREFIX}-stop-button`,
  showOtherAggregated: `${PREFIX}-show-other-aggregated`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface NotificationProps extends CardProps, VirtualScrollerItemProps {
  /**
   * Id of the UserNotification
   * @default `notification_<notificationObject.sid>`
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationAggregatedType;

  /**
   * Handle custom notification
   * @param data
   */
  handleCustomNotification?: (data) => JSX.Element;

  /**
   * Collapse or not other aggregated
   * @default true
   */
  collapsedOtherAggregated?: boolean;

  /**
   * The max n of results uncollapsed shown
   * @default 2
   */
  showMaxAggregated?: number;

  /**
   * The obj key
   */
  key: number;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *
 > API documentation for the Community-JS UserNotification component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserNotification} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCNotification` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCNotification-root|Styles applied to the root element.|
 |content|.SCNotification-notification-wrap|Styles applied to the element wrap.|
 |header|.SCNotification-notification-wrap|Styles applied to the notification header.|
 |title|.SCNotification-title|Styles applied to the title element in the notification header.|
 |image|.SCNotification-image|Styles applied to the image element in the notification header.|
 |username|.SCNotification-username|Styles applied to the user element in the notification header.|
 |content|.SCNotification-notification-content|Styles applied to the notification content.|
 |unCollapsed|.SCNotification-notification-wrap|Styles applied to the uncollapsed elements.|
 |collapsed|.SCNotification-notification-wrap|Styles applied to the collapsed elements.|
 |stopButton|.SCNotification-stop-notification-button|Styles applied to the stop notification button.|
 |showOtherAggregated|.SCNotification-show-other-aggregated|Styles applied to the show other aggregated element.|

 * @param inProps
 */
export default function UserNotification(inProps: NotificationProps): JSX.Element {
  // PROPS
  const props: NotificationProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    id = `notification_${props.notificationObject.sid}`,
    className,
    notificationObject,
    handleCustomNotification,
    showMaxAggregated = 2,
    collapsedOtherAggregated = true,
    onStateChange,
    onHeightChange,
    ...rest
  } = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [obj, setObj] = useState<SCNotificationAggregatedType>(notificationObject);
  const [loadingSuspendNotification, setLoadingSuspendNotification] = useState<boolean>(false);
  const [openOtherAggregated, setOpenOtherAggregated] = useState<boolean>(!collapsedOtherAggregated);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  //INTL
  const intl = useIntl();

  /**
   * Notify changes to Feed if the FeedObject is contained in the feed
   */
  const notifyFeedChanges = useMemo(
    () => (state?: Record<string, any>) => {
      if (onStateChange && state) {
        onStateChange(state);
      }
      onHeightChange && onHeightChange();
    },
    [onStateChange, onHeightChange]
  );

  /**
   * Performs  notification suspension
   */
  const performSuspendNotification = useMemo(
    () => (obj) => {
      return http
        .request({
          url: Endpoints.UserSuspendContributionNotification.url({type: obj.type, id: obj.id}),
          method: Endpoints.UserSuspendContributionNotification.method
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Handles stop notification for contribution
   * @param contribution
   */
  function handleStopContentNotification(contribution) {
    setLoadingSuspendNotification(true);
    performSuspendNotification(contribution)
      .then((data) => {
        const newObj: SCNotificationAggregatedType = obj;
        newObj[contribution.type].suspended = !newObj[contribution.type].suspended;
        setObj(newObj);
        setLoadingSuspendNotification(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Handles vote
   * @param index
   */
  const handleVote = (index) => {
    return (contribution: SCFeedObjectType | SCCommentType) => {
      const newObj: SCNotificationAggregatedType = Object.assign({}, notificationObject);
      const _notification: SCNotificationType = Object.assign({}, newObj.aggregated[index]);
      _notification[contribution.type] = contribution;
      newObj.aggregated[index] = _notification;
      setObj(newObj);
    };
  };

  /**
   * Open/close other aggregated activities
   * The layout change -> call onStateChange
   */
  function setStateAggregated() {
    const _openOtherAggregated = !openOtherAggregated;
    notifyFeedChanges({collapsedOtherAggregated: _openOtherAggregated});
    setOpenOtherAggregated(_openOtherAggregated);
  }

  /**
   * Render:
   * - discussion/post/status summary if notification include contribute
   * - user header for private message
   */
  function renderNotificationHeader() {
    /**
     * Private messages header
     */
    if (notificationObject.aggregated && notificationObject.aggregated[0].type === SCNotificationTypologyType.PRIVATE_MESSAGE) {
      let messageNotification: SCNotificationPrivateMessageType = notificationObject.aggregated[0] as SCNotificationPrivateMessageType;
      return (
        <CardHeader
          className={classes.header}
          avatar={
            <Link
              {...(!messageNotification.message.sender.deleted && {
                to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, messageNotification.message.sender)
              })}
              onClick={messageNotification.message.sender.deleted ? () => setOpenAlert(true) : null}>
              <UserAvatar hide={!messageNotification.message.sender.community_badge} smaller={true}>
                <Avatar
                  className={classes.avatar}
                  alt={messageNotification.message.sender.username}
                  variant="circular"
                  src={messageNotification.message.sender.avatar}
                />
              </UserAvatar>
            </Link>
          }
          titleTypographyProps={{className: classes.title, variant: 'subtitle1'}}
          title={
            <>
              <Link
                {...(!messageNotification.message.sender.deleted && {
                  to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, messageNotification.message.sender)
                })}
                onClick={messageNotification.message.sender.deleted ? () => setOpenAlert(true) : null}
                className={classes.username}>
                {messageNotification.message.sender.username}
              </Link>{' '}
              {intl.formatMessage(messages.receivePrivateMessage, {
                total: notificationObject.aggregated.length,
                b: (...chunks) => <strong>{chunks}</strong>
              })}
            </>
          }
        />
      );
    }
    /**
     * Group notifications header
     */
    if (
      notificationObject.aggregated &&
      (notificationObject.aggregated[0].type === SCNotificationTypologyType.USER_INVITED_TO_JOIN_GROUP ||
        notificationObject.aggregated[0].type === SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_GROUP ||
        notificationObject.aggregated[0].type === SCNotificationTypologyType.USER_ADDED_TO_GROUP ||
        notificationObject.aggregated[0].type === SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_GROUP)
    ) {
      let groupNotification: SCNotificationGroupActivityType = notificationObject.aggregated[0] as SCNotificationGroupActivityType;
      return (
        <CardHeader
          className={classes.header}
          avatar={
            <Link
              {...(!groupNotification.user.deleted && {
                to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, groupNotification.user)
              })}
              onClick={groupNotification.user.deleted ? () => setOpenAlert(true) : null}>
              <UserAvatar hide={!groupNotification.user.community_badge} smaller={true}>
                <Avatar className={classes.avatar} alt={groupNotification.user.username} variant="circular" src={groupNotification.user.avatar} />
              </UserAvatar>
            </Link>
          }
          titleTypographyProps={{className: classes.title, variant: 'subtitle1'}}
          title={
            <>
              <Link
                {...(!groupNotification.user.deleted && {
                  to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, groupNotification.user)
                })}
                onClick={groupNotification.user.deleted ? () => setOpenAlert(true) : null}
                className={classes.username}>
                {groupNotification.user.username}
              </Link>{' '}
              <FormattedMessage
                id={`ui.notification.${notificationObject.aggregated[0].type}`}
                defaultMessage={`ui.notification.${notificationObject.aggregated[0].type}`}
                values={{
                  group: groupNotification.group.name,
                  link: (...chunks) => (
                    <Link
                      to={
                        notificationObject.aggregated[0].type === SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_GROUP ||
                        notificationObject.aggregated[0].type === SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_GROUP
                          ? scRoutingContext.url(SCRoutes.GROUP_MEMBERS_ROUTE_NAME, groupNotification.group)
                          : scRoutingContext.url(SCRoutes.GROUP_ROUTE_NAME, groupNotification.group)
                      }>
                      {chunks}
                    </Link>
                  )
                }}
              />
            </>
          }
        />
      );
    }
    /**
     * Comment, NestedComment, Follow Contribution header
     */
    if (
      notificationObject.aggregated &&
      (notificationObject.aggregated[0].type === SCNotificationTypologyType.COMMENT ||
        notificationObject.aggregated[0].type === SCNotificationTypologyType.NESTED_COMMENT ||
        notificationObject.aggregated[0].type === SCNotificationTypologyType.FOLLOW ||
        notificationObject.aggregated[0].type === SCNotificationTypologyType.MENTION ||
        notificationObject.aggregated[0].type === SCNotificationTypologyType.VOTE_UP ||
        notificationObject.aggregated[0].type === SCNotificationTypologyType.CONTRIBUTION)
    ) {
      const contribution = getContribution(notificationObject);
      return (
        <CardHeader
          className={classes.header}
          titleTypographyProps={{className: classes.title, variant: 'subtitle1'}}
          title={
            <Link to={scRoutingContext.url(getContributionRouteName(contribution), getRouteData(notificationObject[contribution.type]))}>
              {getContributionSnippet(contribution)}
            </Link>
          }
          action={
            contribution && (
              <Tooltip
                title={
                  contribution.suspended ? (
                    <FormattedMessage id={'ui.notification.notificationSuspended'} defaultMessage={'ui.notification.notificationSuspended'} />
                  ) : (
                    <FormattedMessage id={'ui.notification.notificationSuspend'} defaultMessage={'ui.notification.notificationSuspend'} />
                  )
                }>
                <LoadingButton
                  variant="text"
                  size="small"
                  loading={loadingSuspendNotification}
                  color={'inherit'}
                  classes={{root: classes.stopButton}}
                  onClick={() => handleStopContentNotification(contribution)}>
                  {contribution.suspended ? <Icon color={'primary'}>notifications_off</Icon> : <Icon color={'inherit'}>notifications_active</Icon>}
                </LoadingButton>
              </Tooltip>
            )
          }
        />
      );
    }
    return null;
  }

  /**
   * Render every single notification in aggregated group
   * @param n
   * @param i
   */
  function renderAggregatedItem(n, i) {
    if (n.type === SCNotificationTypologyType.COMMENT || n.type === SCNotificationTypologyType.NESTED_COMMENT) {
      return <CommentNotification notificationObject={n} key={i} onVote={handleVote(i)} />;
    } else if (n.type === SCNotificationTypologyType.FOLLOW) {
      return <ContributionFollowNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.USER_FOLLOW) {
      return <UserFollowNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.CONNECTION_REQUEST || n.type === SCNotificationTypologyType.CONNECTION_ACCEPT) {
      return <UserConnectionNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.VOTE_UP) {
      return <VoteUpNotification notificationObject={n} key={i} />;
    } else if (
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_ADVERTISING ||
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_AGGRESSIVE ||
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_POOR ||
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_VULGAR ||
      n.type === SCNotificationTypologyType.KINDLY_NOTICE_OFFTOPIC
    ) {
      return <KindlyNoticeForNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.KINDLY_NOTICE_FLAG) {
      return <KindlyNoticeFlagNotification notificationObject={n} key={i} />;
    } else if (
      n.type === SCNotificationTypologyType.DELETED_FOR_ADVERTISING ||
      n.type === SCNotificationTypologyType.DELETED_FOR_AGGRESSIVE ||
      n.type === SCNotificationTypologyType.DELETED_FOR_POOR ||
      n.type === SCNotificationTypologyType.DELETED_FOR_VULGAR ||
      n.type === SCNotificationTypologyType.DELETED_FOR_OFFTOPIC
    ) {
      return <DeletedForNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.UNDELETED_FOR) {
      return <UndeletedForNotification notificationObject={n} key={i} />;
    } else if (
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_ADVERTISING ||
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_AGGRESSIVE ||
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_POOR ||
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_VULGAR ||
      n.type === SCNotificationTypologyType.COLLAPSED_FOR_OFFTOPIC
    ) {
      return <CollapsedForNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.PRIVATE_MESSAGE) {
      return <PrivateMessageNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.BLOCKED_USER || n.type === SCNotificationTypologyType.UNBLOCKED_USER) {
      return <UserBlockedNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.MENTION) {
      return <MentionNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.INCUBATOR_APPROVED) {
      return <IncubatorApprovedNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.CUSTOM_NOTIFICATION) {
      handleCustomNotification && handleCustomNotification(n);
    } else if (n.type === SCNotificationTypologyType.CONTRIBUTION) {
      return <ContributionNotification notificationObject={n} key={i} onVote={handleVote(i)} />;
    } else if (
      n.type === SCNotificationTypologyType.USER_ADDED_TO_GROUP ||
      n.type === SCNotificationTypologyType.USER_INVITED_TO_JOIN_GROUP ||
      n.type === SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_GROUP ||
      n.type === SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_GROUP
    ) {
      return <GroupNotification notificationObject={n} key={i} />;
    } else if (
      n.type === SCNotificationTypologyType.USER_ADDED_TO_EVENT ||
      n.type === SCNotificationTypologyType.USER_INVITED_TO_JOIN_EVENT ||
      n.type === SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_EVENT ||
      n.type === SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_EVENT
    ) {
      return <EventNotification notificationObject={n} key={i} />;
    } else if (n.type === SCNotificationTypologyType.LIVE_STREAM_STARTED) {
      return <LiveStreamNotification notificationObject={n} key={i} />;
    }
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <>
      <Root id={id} className={classNames(classes.root, className)} {...rest}>
        {renderNotificationHeader()}
        <CardContent className={classes.content}>
          <div className={classes.unCollapsed}>
            {notificationObject.aggregated.slice(0, showMaxAggregated).map((n: SCNotificationType, i) => renderAggregatedItem(n, i))}
          </div>
          {notificationObject.aggregated.length > showMaxAggregated && (
            <>
              <ListItemButton onClick={setStateAggregated} classes={{root: classes.showOtherAggregated}}>
                <ListItemText primary={<FormattedMessage id={'ui.notification.showOthers'} defaultMessage={'ui.notification.showOthers'} />} />
                {openOtherAggregated ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
              </ListItemButton>
              <Collapse in={openOtherAggregated} timeout="auto" unmountOnExit classes={{root: classes.collapsed}}>
                {notificationObject.aggregated.slice(showMaxAggregated).map((n: SCNotificationType, i) => renderAggregatedItem(n, i))}
              </Collapse>
            </>
          )}
        </CardContent>
      </Root>
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
