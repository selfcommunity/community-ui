import React, {useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import CommentNotification from '../Notification/Comment';
import UserFollowNotification from '../Notification/UserFollow';
import UndeletedForNotification from '../Notification/UndeletedFor';
import DeletedForNotification from '../Notification/DeletedFor';
import UserConnectionNotification from '../Notification/UserConnection';
import PrivateMessageNotification from '../Notification/PrivateMessage';
import UserBlockedNotification from '../Notification/UserBlocked';
import MentionNotification from '../Notification/Mention';
import CollapsedForNotification from '../Notification/CollapsedFor';
import KindlyNoticeForNotification from '../Notification/KindlyNoticeFor';
import KindlyNoticeFlagNotification from '../Notification/KindlyNoticeFlag';
import VoteUpNotification from '../Notification/VoteUp';
import {SCOPE_SC_UI} from '../../constants/Errors';
import PubSub from 'pubsub-js';
import ContributionFollowNotification from '../Notification/ContributionFollow';
import {Avatar, Box, CardProps, MenuItem, MenuList, Typography} from '@mui/material';
import IncubatorApprovedNotification from '../Notification/IncubatorApproved';
import classNames from 'classnames';
import Skeleton from './Skeleton';
import {SCNotificationObjectTemplateType} from '../../types';
import ScrollContainer from '../../shared/ScrollContainer';
import {FormattedMessage, useIntl} from 'react-intl';
import {SCNotificationAggregatedType, SCNotificationTopicType, SCNotificationType, SCNotificationTypologyType} from '@selfcommunity/types';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {
  Link,
  SCNotification,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';
import ContributionNotification from '../Notification/Contribution';
import NotificationItem from '../../shared/NotificationItem';
import {PREFIX} from './constants';
import GroupNotification from '../Notification/Group';
import EventNotification from '../Notification/Event/Event';
import LiveStreamNotification from '../Notification/LiveStream';

const classes = {
  root: `${PREFIX}-root`,
  notificationsWrap: `${PREFIX}-notifications-wrap`,
  emptyBoxNotifications: `${PREFIX}-empty-box-notifications`,
  list: `${PREFIX}-list`,
  broadcastMessagesBanner: `${PREFIX}-broadcast-messages-banner`,
  item: `${PREFIX}-item`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface SnippetNotificationsProps extends CardProps {
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
   * Handle custom notification
   * @param data
   */
  handleCustomNotification?: (data) => JSX.Element;

  /**
   * Handle single notification
   * Override content
   */
  handleNotification?: (type, data, content) => JSX.Element;

  /**
   * The max n of results shown
   * @default 20
   */
  showMax?: number;

  /**
   * The obj key
   */
  key?: number;

  /**
   * Props to spread to ScrollContainer component
   * This lib use 'react-custom-scrollbars' component to perform scrollbars
   * For more info: https://github.com/malte-wessel/react-custom-scrollbars/blob/master/docs/API.md
   * @default {}
   */
  ScrollContainerProps?: Record<string, any>;

  /**
   * Callback when click on single notification
   * @param notification
   */
  onNotificationClick?: (event, notification) => void;

  /**
   * Callback on fetch notifications
   * @default null;
   */
  onFetchNotifications?: (data) => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

const PREFERENCES = [SCPreferences.LOGO_NAVBAR_LOGO_MOBILE, SCPreferences.TEXT_APPLICATION_NAME];

/**
 * > API documentation for the Community-JS SnippetNotifications component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the notification list.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/SnippetNotifications)

 #### Import

 ```jsx
 import {SnippetNotifications} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCSnippetNotifications` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCSnippetNotification-root|Styles applied to the root element.|
 |notificationsWrap|.SCSnippetNotification-notification-wrap|Styles applied to the notifications wrap.|
 |emptyBoxNotifications|.SCSnippetNotification-empty-box-notifications|Styles applied to the box indicating that there are no notifications.|
 |list|.SCSnippetNotification-list|Styles applied to the list of notifications.|
 |item|.SCSnippetNotification-item|Styles applied to the single notification.|
 |broadcastMessagesBanner|.SCSnippetNotification-broadcast-messages-banner|Styles applied to the broadcast message banner.|

 * @param inProps
 */
export default function SnippetNotifications(inProps: SnippetNotificationsProps): JSX.Element {
  // PROPS
  const props: SnippetNotificationsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    id = `snippetNotifications`,
    className,
    showMax = 20,
    handleCustomNotification,
    handleNotification,
    ScrollContainerProps = {},
    onNotificationClick,
    onFetchNotifications,
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [notifications, setNotifications] = useState<SCNotificationAggregatedType[]>([]);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // REFS
  const notificationSubscription = useRef(null);

  // Compute preferences
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  // HOOKS
  const intl = useIntl();

  /**
   * Perform vote
   */
  const performFetchNotifications = useMemo(
    () => (): Promise<any> => {
      return http
        .request({
          url: Endpoints.UserNotificationList.url(),
          method: Endpoints.UserNotificationList.method
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    []
  );

  /**
   * Handles vote
   * @param comment
   */
  const fetchNotifications = useMemo(
    () => (): void => {
      setInitialized(true);
      if (!loading) {
        setLoading(true);
        performFetchNotifications()
          .then((data) => {
            setNotifications(data.results);
            setLoading(false);
            scUserContext.refreshCounters();
            onFetchNotifications && onFetchNotifications(data.results);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [loading, notifications.length, onFetchNotifications, setInitialized]
  );

  /**
   * Fetch notifications
   */
  useEffect(() => {
    let _t;
    if (scUserContext.user && !initialized) {
      _t = setTimeout(fetchNotifications);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user, initialized]);

  /**
   * Notification subscriber
   * @param msg
   * @param data
   */
  const notificationSubscriber = (msg, data): void => {
    /**
     * Ignore notifications of type: notification_banner
     * (data.data.activity_type === SCNotificationTypologyType.NOTIFICATION_BANNER)
     */
    if (
      data &&
      data.type === SCNotificationTopicType.INTERACTION &&
      SCNotification.SCNotificationMapping[data.data.activity_type] &&
      !SCNotification.SCSilentSnippetNotifications.includes(data.data.activity_type)
    ) {
      if (data.data.notification_obj) {
        setNotifications([...[{is_new: true, sid: '', aggregated: [data.data.notification_obj]}], ...notifications]);
      }
    }
  };

  const handleSingleNotificationClick = (e, n): void => {
    if (onNotificationClick) {
      onNotificationClick(e, n);
    }
  };

  /**
   * On mount, fetches first page of notifications
   * On mount, subscribe to receive notification updates
   */
  useEffect(() => {
    if (!loading) {
      notificationSubscription.current = PubSub.subscribe(SCNotificationTopicType.INTERACTION, notificationSubscriber);
    }
    return (): void => {
      notificationSubscription.current && PubSub.unsubscribe(notificationSubscription.current);
    };
  }, [loading]);

  /**
   * Render every single notification in aggregated group
   * @param n
   * @param i
   */
  const renderAggregatedItem = (n, i): JSX.Element => {
    const type = n.type;
    let content;
    if (type === SCNotificationTypologyType.COMMENT || type === SCNotificationTypologyType.NESTED_COMMENT) {
      content = <CommentNotification notificationObject={n} key={i} index={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.FOLLOW) {
      content = <ContributionFollowNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.USER_FOLLOW) {
      content = <UserFollowNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.CONNECTION_REQUEST || type === SCNotificationTypologyType.CONNECTION_ACCEPT) {
      content = <UserConnectionNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.VOTE_UP) {
      content = <VoteUpNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (
      type === SCNotificationTypologyType.KINDLY_NOTICE_ADVERTISING ||
      type === SCNotificationTypologyType.KINDLY_NOTICE_AGGRESSIVE ||
      type === SCNotificationTypologyType.KINDLY_NOTICE_POOR ||
      type === SCNotificationTypologyType.KINDLY_NOTICE_VULGAR ||
      type === SCNotificationTypologyType.KINDLY_NOTICE_OFFTOPIC
    ) {
      content = <KindlyNoticeForNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.KINDLY_NOTICE_FLAG) {
      content = <KindlyNoticeFlagNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (
      type === SCNotificationTypologyType.DELETED_FOR_ADVERTISING ||
      type === SCNotificationTypologyType.DELETED_FOR_AGGRESSIVE ||
      type === SCNotificationTypologyType.DELETED_FOR_POOR ||
      type === SCNotificationTypologyType.DELETED_FOR_VULGAR ||
      type === SCNotificationTypologyType.DELETED_FOR_OFFTOPIC
    ) {
      content = <DeletedForNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.UNDELETED_FOR) {
      content = <UndeletedForNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (
      type === SCNotificationTypologyType.COLLAPSED_FOR_ADVERTISING ||
      type === SCNotificationTypologyType.COLLAPSED_FOR_AGGRESSIVE ||
      type === SCNotificationTypologyType.COLLAPSED_FOR_POOR ||
      type === SCNotificationTypologyType.COLLAPSED_FOR_VULGAR ||
      type === SCNotificationTypologyType.COLLAPSED_FOR_OFFTOPIC
    ) {
      content = <CollapsedForNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.PRIVATE_MESSAGE) {
      content = <PrivateMessageNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.BLOCKED_USER || type === SCNotificationTypologyType.UNBLOCKED_USER) {
      content = <UserBlockedNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.MENTION) {
      content = <MentionNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.INCUBATOR_APPROVED) {
      content = <IncubatorApprovedNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.CUSTOM_NOTIFICATION && handleCustomNotification) {
      content = handleCustomNotification(n);
    } else if (type === SCNotificationTypologyType.CONTRIBUTION) {
      content = <ContributionNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (
      n.type === SCNotificationTypologyType.USER_ADDED_TO_GROUP ||
      n.type === SCNotificationTypologyType.USER_INVITED_TO_JOIN_GROUP ||
      n.type === SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_GROUP ||
      n.type === SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_GROUP
    ) {
      return <GroupNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (
      n.type === SCNotificationTypologyType.USER_ADDED_TO_EVENT ||
      n.type === SCNotificationTypologyType.USER_INVITED_TO_JOIN_EVENT ||
      n.type === SCNotificationTypologyType.USER_ACCEPTED_TO_JOIN_EVENT ||
      n.type === SCNotificationTypologyType.USER_REQUESTED_TO_JOIN_EVENT
    ) {
      return <EventNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    } else if (type === SCNotificationTypologyType.LIVE_STREAM_STARTED) {
      content = <LiveStreamNotification notificationObject={n} key={i} template={SCNotificationObjectTemplateType.SNIPPET} />;
    }
    if (type && handleNotification) {
      /** Override content */
      content = handleNotification(type, n, content);
    }
    return content;
  };

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <Box className={classes.notificationsWrap}>
        {!initialized || loading ? (
          <Skeleton elevation={0} />
        ) : (
          <ScrollContainer {...ScrollContainerProps}>
            <MenuList className={classes.list} disabledItemsFocusable disableListWrap>
              {scUserContext.user.unseen_notification_banners_counter ? (
                <MenuItem
                  className={classNames(classes.item, classes.broadcastMessagesBanner)}
                  key="banner"
                  component={Link}
                  to={scRoutingContext.url(SCRoutes.USER_NOTIFICATIONS_ROUTE_NAME, {})}>
                  <NotificationItem
                    template={SCNotificationObjectTemplateType.SNIPPET}
                    isNew
                    disableTypography
                    image={<Avatar alt={preferences[SCPreferences.TEXT_APPLICATION_NAME]} src={preferences[SCPreferences.LOGO_NAVBAR_LOGO_MOBILE]} />}
                    primary={
                      <Typography component={'div'}>
                        {intl.formatMessage(
                          {id: 'ui.snippetNotifications.broadcastMessages', defaultMessage: 'ui.snippetNotifications.broadcastMessages'},
                          {
                            count: scUserContext.user.unseen_notification_banners_counter,
                            b: (...chunks) => <strong>{chunks}</strong>,
                            link: (...chunks) => <Link to={scRoutingContext.url(SCRoutes.USER_NOTIFICATIONS_ROUTE_NAME, {})}>{chunks}</Link>
                          }
                        )}
                      </Typography>
                    }
                  />
                </MenuItem>
              ) : null}
              {notifications.length === 0 ? (
                <MenuItem className={classes.emptyBoxNotifications}>
                  <FormattedMessage
                    id="ui.snippetNotifications.noNotifications"
                    defaultMessage="ui.snippetNotifications.noNotifications"></FormattedMessage>
                </MenuItem>
              ) : (
                notifications.slice(0, showMax).map((notificationObject: SCNotificationAggregatedType, i) =>
                  notificationObject.aggregated.map((n: SCNotificationType, k) => (
                    <MenuItem className={classes.item} key={k} onClick={(e) => handleSingleNotificationClick(e, n)} disableRipple disableTouchRipple>
                      {renderAggregatedItem(n, i)}
                    </MenuItem>
                  ))
                )
              )}
            </MenuList>
          </ScrollContainer>
        )}
      </Box>
    </Root>
  );
}
