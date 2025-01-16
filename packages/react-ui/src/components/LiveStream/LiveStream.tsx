import {Avatar, Box, Button, CardActions, CardContent, CardMedia, Chip, Divider, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Link, SCRoutes, SCRoutingContextType, useSCFetchLiveStream, useSCRouting} from '@selfcommunity/react-core';
import {SCLiveStreamType} from '@selfcommunity/types';
import classNames from 'classnames';
import React, {useMemo} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import BaseItem from '../../shared/BaseItem';
import Calendar from '../../shared/Calendar';
import {SCLiveStreamTemplateType} from '../../types/liveStream';
import User from '../User';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import {LiveStreamSkeleton, LiveStreamSkeletonProps} from './index';
import LiveStreamInfoDetails from '../../shared/LiveStreamInfoDetails';

const classes = {
  root: `${PREFIX}-root`,
  detailRoot: `${PREFIX}-detail-root`,
  previewRoot: `${PREFIX}-preview-root`,
  snippetRoot: `${PREFIX}-snippet-root`,
  detailImageWrapper: `${PREFIX}-detail-image-wrapper`,
  detailImage: `${PREFIX}-detail-image`,
  detailInProgress: `${PREFIX}-detail-in-progress`,
  detailNameWrapper: `${PREFIX}-detail-name-wrapper`,
  detailName: `${PREFIX}-detail-name`,
  detailContent: `${PREFIX}-detail-content`,
  detailUser: `${PREFIX}-detail-user`,
  detailFirstDivider: `${PREFIX}-detail-first-divider`,
  detailSecondDivider: `${PREFIX}-detail-second-divider`,
  detailActions: `${PREFIX}-detail-actions`,
  previewImageWrapper: `${PREFIX}-preview-image-wrapper`,
  previewImage: `${PREFIX}-preview-image`,
  previewInProgress: `${PREFIX}-preview-in-progress`,
  previewNameWrapper: `${PREFIX}-preview-name-wrapper`,
  previewName: `${PREFIX}-preview-name`,
  previewContent: `${PREFIX}-preview-content`,
  previewActions: `${PREFIX}-preview-actions`,
  snippetImage: `${PREFIX}-snippet-image`,
  snippetAvatar: `${PREFIX}-snippet-avatar`,
  snippetInProgress: `${PREFIX}-snippet-in-progress`,
  snippetPrimary: `${PREFIX}-snippet-primary`,
  snippetSecondary: `${PREFIX}-snippet-secondary`,
  snippetActions: `${PREFIX}-snippet-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

const DetailRoot = styled(Box, {
  name: PREFIX,
  slot: 'DetailRoot',
  overridesResolver: (props, styles) => styles.detailRoot
})(() => ({}));

const PreviewRoot = styled(Box, {
  name: PREFIX,
  slot: 'PreviewRoot',
  overridesResolver: (props, styles) => styles.previewRoot
})(() => ({}));

const SnippetRoot = styled(BaseItem, {
  name: PREFIX,
  slot: 'SnippetRoot',
  overridesResolver: (props, styles) => styles.snippetRoot
})(() => ({}));

export interface LiveStreamProps extends WidgetProps {
  /**
   * Event Object
   * @default null
   */
  liveStream?: SCLiveStreamType;
  /**
   * Id of the liveStream for filter the feed
   * @default null
   */
  liveStreamId?: number;
  /**
   * Event template type
   * @default 'preview'
   */
  template?: SCLiveStreamTemplateType;
  /**
   * Actions
   * @default null
   */
  actions?: React.ReactNode;
  /**
   * Hide in progress
   * @default false
   */
  hideInProgress?: boolean;
  /**
   * Hide liveStream planner
   * @default false
   */
  hideLiveStreamHost?: boolean;
  /**
   * Props to spread to EventSkeleton component
   * @default {}
   */
  LiveStreamSkeletonComponentProps?: LiveStreamSkeletonProps;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Live Stream component. Learn about the available props and the CSS API.
 *
 *
 * This component renders an liveStream item.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/Event)

 #### Import

 ```jsx
 import {liveStream} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLiveStream` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLiveStream-root|Styles applied to the root element.|
 |avatar|.SCLiveStream-avatar|Styles applied to the avatar element.|
 |primary|.SCLiveStream-primary|Styles applied to the primary item element section|
 |secondary|.SCLiveStream-secondary|Styles applied to the secondary item element section|
 |actions|.SCLiveStream-actions|Styles applied to the actions section.|


 *
 * @param inProps
 */
export default function LiveStream(inProps: LiveStreamProps): JSX.Element {
  // PROPS
  const props: LiveStreamProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = `live_stream_object_${props.liveStreamId ? props.liveStreamId : props.liveStream ? props.liveStream.id : ''}`,
    liveStreamId = null,
    liveStream = null,
    className = null,
    template = SCLiveStreamTemplateType.SNIPPET,
    hideInProgress = false,
    hideLiveStreamHost = false,
    actions,
    EventSkeletonComponentProps = {},
    ...rest
  } = props;

  // STATE
  const {scLiveStream} = useSCFetchLiveStream({id: liveStreamId, liveStream});
  const inProgress = useMemo(() => scLiveStream /* && scLiveStream.running */, [scLiveStream]);

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HOOKS
  const intl = useIntl();
  /**
   * Renders liveStream object
   */
  if (!scLiveStream) {
    return <LiveStreamSkeleton template={template} {...EventSkeletonComponentProps} {...rest} actions={actions} />;
  }

  /**
   * Renders liveStream object
   */
  let contentObj: React.ReactElement;
  if (template === SCLiveStreamTemplateType.DETAIL) {
    contentObj = (
      <DetailRoot className={classes.detailRoot}>
        <Box className={classes.detailImageWrapper}>
          <CardMedia component="img" image={scLiveStream.cover} alt={scLiveStream.title} className={classes.detailImage} />
          {!hideInProgress && inProgress && (
            <Chip
              size="small"
              component="div"
              label={<FormattedMessage id="ui.liveStream.inProgress" defaultMessage="ui.liveStream.inProgress" />}
              className={classes.detailInProgress}
            />
          )}
          <Calendar day={new Date(scLiveStream.created_at).getDate()} />
        </Box>
        <CardContent className={classes.detailContent}>
          <Box className={classes.detailNameWrapper}>
            <Typography variant="h3" className={classes.detailName}>
              {scLiveStream.title}
            </Typography>
          </Box>
          <LiveStreamInfoDetails liveStream={scLiveStream} />
          {!hideLiveStreamHost && (
            <User
              user={scLiveStream.host}
              elevation={0}
              secondary={
                <Typography variant="caption">
                  <FormattedMessage id="ui.myEventsWidget.planner" defaultMessage="ui.myEventsWidget.planner" />
                </Typography>
              }
              actions={<></>}
              className={classes.detailUser}
            />
          )}
          <Divider className={classes.detailSecondDivider} />
        </CardContent>
        {actions ?? (
          <CardActions className={classes.detailActions}>
            <Button size="small" variant="outlined" component={Link} to={scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, scLiveStream)}>
              <FormattedMessage defaultMessage="ui.liveStream.see" id="ui.liveStream.see" />
            </Button>
          </CardActions>
        )}
      </DetailRoot>
    );
  } else if (template === SCLiveStreamTemplateType.PREVIEW) {
    contentObj = (
      <PreviewRoot className={classes.previewRoot}>
        <Box position="relative" className={classes.previewImageWrapper}>
          <CardMedia component="img" image={scLiveStream.cover} alt={scLiveStream.title} className={classes.previewImage} />
          {!hideInProgress && inProgress && (
            <Chip
              size="small"
              component="div"
              label={<FormattedMessage id="ui.liveStream.inProgress" defaultMessage="ui.liveStream.inProgress" />}
              className={classes.previewInProgress}
            />
          )}
        </Box>
        <CardContent className={classes.previewContent}>
          <LiveStreamInfoDetails
            liveStream={scLiveStream}
            beforeDateInfo={
              <Link to={scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, scLiveStream)} className={classes.previewNameWrapper}>
                <Typography variant="h5" className={classes.previewName}>
                  {scLiveStream.title}
                </Typography>
              </Link>
            }
          />
        </CardContent>
        {actions ?? (
          <CardActions className={classes.previewActions}>
            <Button size="small" variant="outlined" component={Link} to={scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, scLiveStream)}>
              <FormattedMessage defaultMessage="ui.liveStream.see" id="ui.liveStream.see" />
            </Button>
          </CardActions>
        )}
      </PreviewRoot>
    );
  } else {
    contentObj = (
      <SnippetRoot
        elevation={0}
        square={true}
        disableTypography
        className={classes.snippetRoot}
        image={
          <Box className={classes.snippetImage}>
            <Avatar variant="square" alt={scLiveStream.title} src={scLiveStream.cover} className={classes.snippetAvatar} />{' '}
            {!hideInProgress && inProgress && (
              <Chip
                size="small"
                component="div"
                label={<FormattedMessage id="ui.liveStream.inProgress" defaultMessage="ui.liveStream.inProgress" />}
                className={classes.snippetInProgress}
              />
            )}
          </Box>
        }
        primary={
          <Link {...(scLiveStream.id && {to: scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, scLiveStream)})} className={classes.snippetPrimary}>
            <Typography component="span">{`${intl.formatDate(scLiveStream.created_at, {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}`}</Typography>
            <Typography variant="body1">{scLiveStream.title}</Typography>
          </Link>
        }
        secondary={
          <Typography component="p" variant="body2" className={classes.snippetSecondary}>
            <FormattedMessage id={`ui.eventForm.address.liveStream.label`} defaultMessage={`ui.eventForm.address.liveStream.label`} />
          </Typography>
        }
        actions={
          actions ?? (
            <Box className={classes.snippetActions}>
              <Button size="small" variant="outlined" component={Link} to={scRoutingContext.url(SCRoutes.LIVESTREAM_ROUTE_NAME, scLiveStream)}>
                <FormattedMessage defaultMessage="ui.liveStream.see" id="ui.liveStream.see" />
              </Button>
            </Box>
          )
        }
      />
    );
  }
  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      {contentObj}
    </Root>
  );
}
