import {Box, Icon, Stack, styled, Tooltip, Typography, useThemeProps} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCFetchLiveStream, useSCRouting} from '@selfcommunity/react-core';
import {SCLiveStreamType} from '@selfcommunity/types';
import {ReactNode} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

const PREFIX = 'SCLiveStreamInfoDetails';

const classes = {
  root: `${PREFIX}-root`,
  iconTextWrapper: `${PREFIX}-icon-text-wrapper`,
  inProgress: `${PREFIX}-in-progress`,
  link: `${PREFIX}-link`,
  url: `${PREFIX}-url`,
  creationWrapper: `${PREFIX}-creation-wrapper`
};

const Root = styled(Stack, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface LiveStreamInfoDetailsProps {
  liveStream: SCLiveStreamType;
  liveStreamId?: number;
  hideDateIcon?: boolean;
  hideLocationIcon?: boolean;
  hideCreatedIcon?: boolean;
  hasDateInfo?: boolean;
  hasLocationInfo?: boolean;
  hasCreatedInfo?: boolean;
  hasInProgress?: boolean;
  beforeDateInfo?: ReactNode | null;
  beforeLocationInfo?: ReactNode | null;
  beforeCreatedInfo?: ReactNode | null;
}

export default function LiveStreamInfoDetails(inProps: LiveStreamInfoDetailsProps) {
  // PROPS
  const props: LiveStreamInfoDetailsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    liveStream,
    liveStreamId,
    hideDateIcon = false,
    hideLocationIcon = false,
    hideCreatedIcon = false,
    hasDateInfo = true,
    hasLocationInfo = true,
    hasCreatedInfo = false,
    hasInProgress = false,
    beforeDateInfo,
    beforeLocationInfo,
    beforeCreatedInfo
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HOOKS
  const intl = useIntl();
  const {scLiveStream} = useSCFetchLiveStream({id: liveStreamId, liveStream});

  if (!scLiveStream) {
    return null;
  }

  return (
    <Root className={classes.root}>
      {beforeDateInfo}
      {hasDateInfo && (
        <Stack className={classes.iconTextWrapper}>
          {!hideDateIcon && <Icon fontSize="small">{scLiveStream.closed_at_by_host ? 'calendar_off' : 'CalendarIcon'}</Icon>}
          <Typography variant="body1">
            <FormattedMessage
              id="ui.eventInfoDetails.date.startEndTime"
              defaultMessage="ui.eventInfoDetails.date.startEndTime"
              values={{
                date: intl.formatDate(scLiveStream.created_at, {
                  weekday: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  month: 'long'
                }),
                start: intl.formatDate(scLiveStream.created_at, {hour: 'numeric', minute: 'numeric'})
              }}
            />
          </Typography>
          {hasInProgress && scLiveStream.last_started_at && (
            <Tooltip title={<FormattedMessage id="ui.eventInfoDetails.inProgress" defaultMessage="ui.eventInfoDetails.inProgress" />}>
              <Box className={classes.inProgress} />
            </Tooltip>
          )}
        </Stack>
      )}
      {beforeLocationInfo}
      {hasLocationInfo && (
        <Stack className={classes.iconTextWrapper}>
          {!hideLocationIcon && <Icon fontSize="small">play_circle_outline</Icon>}
          <Link to={scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, scLiveStream)} target="_blank" className={classes.link}>
            <Typography variant="body1" className={classes.url}>
              {scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, scLiveStream)}
            </Typography>
          </Link>
        </Stack>
      )}
      {beforeCreatedInfo}
      {hasCreatedInfo && (
        <Stack className={classes.creationWrapper}>
          {!hideCreatedIcon && <Icon fontSize="small">create</Icon>}
          <Typography variant="body1">
            <FormattedMessage
              id="ui.eventInfoDetails.date.create"
              defaultMessage="ui.eventInfoDetails.date.create"
              values={{
                date: intl.formatDate(scLiveStream.created_at, {
                  weekday: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  month: 'long'
                })
              }}
            />
          </Typography>
        </Stack>
      )}
    </Root>
  );
}
