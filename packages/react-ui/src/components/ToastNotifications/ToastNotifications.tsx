import React, {useEffect, useRef} from 'react';
import {styled} from '@mui/material/styles';
import {Box, BoxProps} from '@mui/material';
import {SCContextType, SCNotification, SCUserContextType, useSCAlertMessages, useSCContext, useSCUser} from '@selfcommunity/react-core';
import {SCNotificationTopicType, SCNotificationTypologyType} from '@selfcommunity/types';
import PubSub from 'pubsub-js';
import {BaseVariant, useSnackbar} from 'notistack';
import {PREFIX} from './constants';
import {SCBroadcastMessageTemplateType, SCNotificationObjectTemplateType} from '../../types';
import CustomSnackMessage from '../../shared/CustomSnackMessage';
import CommentNotification from '../Notification/Comment';
import ContributionFollowNotification from '../Notification/ContributionFollow';
import UserFollowNotification from '../Notification/UserFollow';
import UserConnectionNotification from '../Notification/UserConnection';
import VoteUpNotification from '../Notification/VoteUp';
import PrivateMessageNotification from '../Notification/PrivateMessage';
import MentionNotification from '../Notification/Mention';
import KindlyNoticeFlagNotification from '../Notification/KindlyNoticeFlag';
import IncubatorApprovedNotification from '../Notification/IncubatorApproved';
import UserBlockedNotification from '../Notification/UserBlocked';
import Message from '../BroadcastMessages/Message';
import {useThemeProps} from '@mui/system';
import ContributionNotification from '../Notification/Contribution';
import GroupNotification from '../Notification/Group';
import EventNotification from '../Notification/Event/Event';
import LiveStreamNotification from '../Notification/LiveStream';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface ToastNotificationsProps extends BoxProps {
  /**
   * Handle notification
   */
  handleNotification?: (type, data, content) => JSX.Element;

  /**
   * Disable Toast Notification
   */
  disableToastNotification?: boolean;

  /**
   * Other props
   */
  [p: string]: any;
}
/**
 * > API documentation for the Community-JS Toast Notifications component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ToastNotifications} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCToastNotifications` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserNotifications-root|Styles applied to the root element.|
 |toastMessage|.SCUserToastNotifications-toast-message|Styles applied to the toast message element.|
 |toastContent|.SCUserToastNotifications-toast-content|Styles applied to the toast content element.|
 |toastActions|.SCUserToastNotifications-toast-actions|Styles applied to the toast actions section.|

 * @param inProps
 */
export default function UserToastNotifications(inProps: ToastNotificationsProps): JSX.Element {
  // PROPS
  const props: ToastNotificationsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {handleNotification, disableToastNotification = false} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  // REFS
  const notificationSubscription = useRef(null);

  // CONTEXT
  const {enqueueSnackbar} = useSnackbar();
  const {options, setOptions} = useSCAlertMessages();

  /**
   * Render every single notification content
   * @param n
   */
  const getContent = (n) => {
    let content;
    let type;
    if (n.notification_obj) {
      /** Notification of types: comment, nested_comment, etc... */
      type = SCNotification.SCNotificationMapping[n.activity_type];
      if (type === SCNotificationTypologyType.COMMENT || type === SCNotificationTypologyType.NESTED_COMMENT) {
        content = <CommentNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.FOLLOW) {
        content = <ContributionFollowNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.USER_FOLLOW) {
        content = <UserFollowNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.CONNECTION_REQUEST || type === SCNotificationTypologyType.CONNECTION_ACCEPT) {
        content = <UserConnectionNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.VOTE_UP) {
        content = <VoteUpNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.PRIVATE_MESSAGE) {
        content = <PrivateMessageNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.BLOCKED_USER || type === SCNotificationTypologyType.UNBLOCKED_USER) {
        return <UserBlockedNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.MENTION) {
        content = <MentionNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.KINDLY_NOTICE_FLAG) {
        content = <KindlyNoticeFlagNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.INCUBATOR_APPROVED) {
        content = <IncubatorApprovedNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.CONTRIBUTION) {
        content = <ContributionNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      } else if (
        type === SCNotificationTypologyType.USER_ADDED_TO_GROUP ||
        type === SCNotificationTypologyType.USER_INVITED_TO_JOIN_GROUP ||
        type === SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_GROUP ||
        type === SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_GROUP
      ) {
        content = <GroupNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      } else if (
        type === SCNotificationTypologyType.USER_ADDED_TO_EVENT ||
        type === SCNotificationTypologyType.USER_INVITED_TO_JOIN_EVENT ||
        type === SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_EVENT ||
        type === SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_EVENT
      ) {
        content = <EventNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      } else if (type === SCNotificationTypologyType.LIVE_STREAM_STARTED) {
        content = <LiveStreamNotification notificationObject={n.notification_obj} template={SCNotificationObjectTemplateType.TOAST} />;
      }
    }
    if (n.activity_type && n.activity_type === SCNotificationTypologyType.NOTIFICATION_BANNER) {
      /** Notification of type: 'notification_banner' */
      content = <Message key={n.notification_obj.id} message={n.notification_obj} elevation={0} template={SCBroadcastMessageTemplateType.TOAST} />;
    }
    if (handleNotification && type) {
      /** Override content */
      content = handleNotification(type, n, content);
    }
    return content;
  };

  /**
   * Notification subscriber
   * @param msg
   * @param data
   */
  const notificationSubscriber = (msg, data) => {
    if (
      data &&
      data.type === SCNotificationTopicType.INTERACTION &&
      (data.data.activity_type === SCNotificationTypologyType.NOTIFICATION_BANNER || SCNotification.SCNotificationMapping[data.data.activity_type]) &&
      !SCNotification.SCSilentToastNotifications.includes(data.data.activity_type) &&
      !disableToastNotification &&
      !scContext.settings.notifications.webSocket.disableToastMessage &&
      scUserContext.managers.settings.get(SCNotification.NOTIFICATIONS_SETTINGS_SHOW_TOAST)
    ) {
      /**
       * !IMPORTANT
       * - messageKey for the notification_banner is 'id', for others type 'feed_serialization_id'
       * - the enqueue message is persistent (it remains on the screen while the others replace each other) if type notification_banner
       */
      const messageKey = data.data.feed_serialization_id ? data.data.feed_serialization_id : data.data.id;
      enqueueSnackbar(getContent(data.data), {
        preventDuplicate: true,
        key: messageKey,
        variant: 'notification' as BaseVariant,
        persist: data.data.activity_type === SCNotificationTypologyType.NOTIFICATION_BANNER ? true : false,
        anchorOrigin: {horizontal: 'left', vertical: 'bottom'},
        action: null,
        SnackbarProps: {
          id: messageKey
        }
      });
    }
  };

  /**
   * On mount, fetches first page of notifications
   * On mount, subscribe to receive notification updates
   */
  useEffect(() => {
    notificationSubscription.current = PubSub.subscribe(SCNotificationTopicType.INTERACTION, notificationSubscriber);
    return () => {
      PubSub.unsubscribe(notificationSubscription.current);
    };
  }, [scUserContext.managers.settings.all]);

  useEffect(() => {
    setOptions({...options, Components: {...options?.Components, notification: CustomSnackMessage}});
  }, [scUserContext.managers.settings.all]);

  return <Root />;
}
