import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Icon, Stack, Typography} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {SCNotificationLiveStreamActivityType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import {LoadingButton} from '@mui/lab';
import UserDeletedSnackBar from '../../../shared/UserDeletedSnackBar';
import UserAvatar from '../../../shared/UserAvatar';
import {PREFIX} from '../constants';
import LiveStream from '../../LiveStream';

const classes = {
  root: `${PREFIX}-live-root`,
  avatar: `${PREFIX}-avatar`,
  actions: `${PREFIX}-actions`,
  seeButton: `${PREFIX}see-button`,
  activeAt: `${PREFIX}-active-at`,
  snippetTime: `${PREFIX}-snippet-time`,
  username: `${PREFIX}-username`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'LiveStreamRoot'
})(() => ({}));

export interface NotificationLiveStreamProps
  extends Pick<
    NotificationItemProps,
    Exclude<
      keyof NotificationItemProps,
      'image' | 'disableTypography' | 'primary' | 'primaryTypographyProps' | 'secondary' | 'secondaryTypographyProps' | 'actions' | 'footer' | 'isNew'
    >
  > {
  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationLiveStreamActivityType;
}

/**
 * This component render the content of the notification of type live stream
 * @constructor
 * @param props
 */
export default function LiveStreamNotification(props: NotificationLiveStreamProps): JSX.Element {
  // PROPS
  const {
    notificationObject,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = SCNotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // CONST
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;
  const isToastTemplate = template === SCNotificationObjectTemplateType.TOAST;
  const inProgress = Boolean(
    !notificationObject.live_stream.closed_at_by_host &&
      notificationObject.live_stream.last_started_at &&
      !notificationObject.live_stream.last_finished_at
  );

  // RENDER
  if (isSnippetTemplate) {
    return (
      <Root
        id={id}
        className={classNames(classes.root, className, `${PREFIX}-${template}`)}
        template={template}
        isNew={notificationObject.is_new}
        disableTypography
        image={
          <Link
            {...(!notificationObject.live_stream.host.deleted && {
              to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.live_stream.host)
            })}
            onClick={notificationObject.live_stream.host.deleted ? () => setOpenAlert(true) : null}>
            <UserAvatar hide={!notificationObject.live_stream.host.community_badge} smaller={true}>
              <Avatar
                alt={notificationObject.live_stream.host.username}
                variant="circular"
                src={notificationObject.live_stream.host.avatar}
                classes={{root: classes.avatar}}
              />
            </UserAvatar>
          </Link>
        }
        primary={
          <Box>
            <Link
              {...(!notificationObject.live_stream.host.deleted && {
                to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.live_stream.host)
              })}
              onClick={notificationObject.live_stream.host.deleted ? () => setOpenAlert(true) : null}
              className={classes.username}>
              {notificationObject.live_stream.host.username}
            </Link>{' '}
            <FormattedMessage
              id={`ui.notification.${notificationObject.type}.title`}
              defaultMessage={`ui.notification.${notificationObject.type}.title`}
              values={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                icon: (...chunks) => <Icon>{chunks}</Icon>,
                live: notificationObject.live_stream.title,
                link: (...chunks) => <Link to={scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, notificationObject.live_stream)}>{chunks}</Link>
              }}
            />
          </Box>
        }
        footer={
          isToastTemplate ? (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <DateTimeAgo date={notificationObject.active_at} />
              <Typography color="primary">
                <Link to={scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, notificationObject.live_stream)}>
                  <FormattedMessage id="ui.notification.live_stream_started.join" defaultMessage="ui.notification.live_stream_started.join" />
                </Link>
              </Typography>
            </Stack>
          ) : (
            <DateTimeAgo date={notificationObject.active_at} className={classes.snippetTime} />
          )
        }
        {...rest}
      />
    );
  }
  return (
    <>
      <Root
        id={id}
        className={classNames(classes.root, className, `${PREFIX}-${template}`)}
        template={template}
        isNew={notificationObject.is_new}
        disableTypography
        image={
          <Link
            {...(!notificationObject.live_stream.host.deleted && {
              to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.live_stream.host)
            })}
            onClick={notificationObject.live_stream.host.deleted ? () => setOpenAlert(true) : null}>
            <UserAvatar hide={!notificationObject.live_stream.host.community_badge} smaller={true}>
              <Avatar
                className={classes.avatar}
                alt={notificationObject.live_stream.host.username}
                variant="circular"
                src={notificationObject.live_stream.host.avatar}
              />
            </UserAvatar>
          </Link>
        }
        primary={
          <>
            <Link
              {...(!notificationObject.live_stream.host.deleted && {
                to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.live_stream.host)
              })}
              onClick={notificationObject.live_stream.host.deleted ? () => setOpenAlert(true) : null}
              className={classes.username}>
              {notificationObject.live_stream.host.username}
            </Link>{' '}
            <FormattedMessage
              id={`ui.notification.${notificationObject.type}`}
              defaultMessage={`ui.notification.${notificationObject.type}`}
              values={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                live: notificationObject.live_stream.title,
                link: (...chunks) => <Link to={scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, notificationObject.live_stream)}>{chunks}</Link>
              }}
            />
            <LiveStream liveStream={notificationObject.live_stream as any} hideInProgress={!inProgress} actions={<></>} elevation={0} />
          </>
        }
        actions={
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
            <LoadingButton
              color={'primary'}
              variant="outlined"
              size="small"
              classes={{root: classes.seeButton}}
              component={Link}
              disabled={Boolean(notificationObject.live_stream.closed_at_by_host)}
              to={scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, notificationObject.live_stream)}>
              <FormattedMessage id="ui.notification.live_stream_started.join" defaultMessage="ui.notification.live_stream_started.join" />
            </LoadingButton>
          </Stack>
        }
        {...rest}
      />
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
