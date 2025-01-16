import {AvatarGroup, Box, Button, CardActions, CardContent, Divider, Icon, Stack, useTheme} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {SCThemeType} from '@selfcommunity/react-core';
import classNames from 'classnames';
import React from 'react';
import BaseItem from '../../shared/BaseItem';
import {SCLiveStreamTemplateType} from '../../types/liveStream';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  skeletonDetailRoot: `${PREFIX}-skeleton-detail-root`,
  skeletonPreviewRoot: `${PREFIX}-skeleton-preview-root`,
  skeletonSnippetRoot: `${PREFIX}-skeleton-snippet-root`,
  skeletonDetailCalendar: `${PREFIX}-skeleton-detail-calendar`,
  skeletonDetailContent: `${PREFIX}-skeleton-detail-content`,
  skeletonDetailActions: `${PREFIX}-skeleton-detail-actions`,
  skeletonDetailUser: `${PREFIX}-skeleton-detail-user`,
  skeletonDetailFirstDivider: `${PREFIX}-skeleton-detail-first-divider`,
  skeletonDetailSecondDivider: `${PREFIX}-skeleton-detail-second-divider`,
  skeletonPreviewContent: `${PREFIX}-skeleton-preview-content`,
  skeletonPreviewName: `${PREFIX}-skeleton-preview-name`,
  skeletonPreviewActions: `${PREFIX}-skeleton-preview-actions`,
  skeletonSnippetImage: `${PREFIX}-skeleton-snippet-image`,
  skeletonSnippetAction: `${PREFIX}-skeleton-snippet-action`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

const SkeletonDetailRoot = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonDetailRoot'
})(() => ({}));

const SkeletonPreviewRoot = styled(Box, {
  name: PREFIX,
  slot: 'SkeletonPreviewRoot'
})(() => ({}));

const SkeletonSnippetRoot = styled(BaseItem, {
  name: PREFIX,
  slot: 'SkeletonSnippetRoot'
})(() => ({}));

export interface LiveStreamSkeletonProps extends WidgetProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * LiveStream template type
   * @default 'preview'
   */
  template?: SCLiveStreamTemplateType;
  /**
   * Disable skeleton animation
   */
  skeletonsAnimation?: false | 'wave' | 'pulse';
  /**
   * Prop to pass an action to be rendered next to the skeleton
   */
  actions?: React.ReactNode;
}

/**
 * > API documentation for the Community-JS LiveStream Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LiveStreamSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLiveStream-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLiveStream-skeleton-root|Styles applied to the root element.|
 |image|.SCLiveStream-skeleton-image|Styles applied to the image element.|
 |action|.SCLiveStream-skeleton-action|Styles applied to action section.|
 *
 */
export default function LiveStreamSkeleton(inProps: LiveStreamSkeletonProps): JSX.Element {
  // PROPS
  const props: LiveStreamSkeletonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, template = SCLiveStreamTemplateType.SNIPPET, skeletonsAnimation = 'wave', actions, ...rest} = props;
  const theme = useTheme<SCThemeType>();

  /**
   * Renders liveStream object
   */
  let contentObj: React.ReactElement;
  if (template === SCLiveStreamTemplateType.DETAIL) {
    contentObj = (
      <SkeletonDetailRoot className={classes.skeletonDetailRoot}>
        <Box position="relative">
          <Skeleton variant="rectangular" animation={skeletonsAnimation} width="100%" height="170px" />
          <Skeleton className={classes.skeletonDetailCalendar} variant="rounded" animation={skeletonsAnimation} width="60px" height="60px" />
        </Box>

        <CardContent className={classes.skeletonDetailContent}>
          <Skeleton animation={skeletonsAnimation} width="36%" height="40px" />

          <Stack direction="row" alignItems="center" gap="8px" marginBottom="9px">
            <Skeleton animation={skeletonsAnimation} variant="circular" width="21px" height="21px" />
            <Skeleton animation={skeletonsAnimation} width="50%" height="20px" />
          </Stack>

          <Stack direction="row" alignItems="center" gap="8px" marginBottom="9px">
            <Skeleton animation={skeletonsAnimation} variant="circular" width="21px" height="21px" />
            <Skeleton animation={skeletonsAnimation} width="35%" height="20px" />
          </Stack>

          <Stack direction="row" alignItems="center" gap="8px" marginBottom="14px">
            <Skeleton animation={skeletonsAnimation} variant="circular" width="21px" height="21px" />
            <Skeleton animation={skeletonsAnimation} width="27%" height="20px" />
          </Stack>

          <Stack direction="row" gap="8px" className={classes.skeletonDetailUser}>
            <Skeleton animation={skeletonsAnimation} variant="circular" width="36px" height="36px" />
            <Stack gap="1px">
              <Skeleton animation={skeletonsAnimation} width="75px" height="15px" />
              <Skeleton animation={skeletonsAnimation} width="86px" height="16px" />
            </Stack>
          </Stack>

          <Divider className={classes.skeletonDetailFirstDivider} />

          <Stack direction="row" gap="8px" alignItems="center" height="28px">
            <Skeleton animation={skeletonsAnimation} width="68px" height="20px" />
            <AvatarGroup>
              <Skeleton animation={skeletonsAnimation} variant="circular" width="21px" height="21px" />
              <Skeleton animation={skeletonsAnimation} variant="circular" width="21px" height="21px" />
              <Skeleton animation={skeletonsAnimation} variant="circular" width="21px" height="21px" />
              <Skeleton animation={skeletonsAnimation} variant="circular" width="21px" height="21px" />
            </AvatarGroup>
          </Stack>

          <Divider className={classes.skeletonDetailSecondDivider} />
        </CardContent>
        <CardActions className={classes.skeletonDetailActions}>
          {actions !== undefined ? actions : <Skeleton variant="rounded" width={100} height={30} />}
        </CardActions>
      </SkeletonDetailRoot>
    );
  } else if (template === SCLiveStreamTemplateType.PREVIEW) {
    contentObj = (
      <SkeletonPreviewRoot className={classes.skeletonPreviewRoot}>
        <Box position="relative">
          <Skeleton variant="rectangular" animation={skeletonsAnimation} width="100%" height="80px" />
        </Box>

        <CardContent className={classes.skeletonPreviewContent}>
          <Stack direction="row" alignItems="center" gap="8px">
            <Skeleton animation={skeletonsAnimation} variant="circular" width="21px" height="21px" />
            <Skeleton animation={skeletonsAnimation} width="50%" height="20px" />
          </Stack>

          <Skeleton animation={skeletonsAnimation} width="67%" height="25px" className={classes.skeletonPreviewName} />

          <Stack direction="row" alignItems="center" gap="8px" marginBottom="2px">
            <Skeleton animation={skeletonsAnimation} width="27%" height="18px" />
          </Stack>

          <Stack direction="row" gap="8px" alignItems="center">
            <AvatarGroup>
              <Skeleton
                animation={skeletonsAnimation}
                variant="circular"
                width={`${theme.selfcommunity.user.avatar.sizeSmall}px`}
                height={`${theme.selfcommunity.user.avatar.sizeSmall}px`}
              />
              <Skeleton
                animation={skeletonsAnimation}
                variant="circular"
                width={`${theme.selfcommunity.user.avatar.sizeSmall}px`}
                height={`${theme.selfcommunity.user.avatar.sizeSmall}px`}
              />
              <Skeleton
                animation={skeletonsAnimation}
                variant="circular"
                width={`${theme.selfcommunity.user.avatar.sizeSmall}px`}
                height={`${theme.selfcommunity.user.avatar.sizeSmall}px`}
              />
            </AvatarGroup>
          </Stack>
        </CardContent>
        <CardActions className={classes.skeletonPreviewActions}>
          {actions !== undefined ? actions : <Skeleton variant="rounded" width={100} height={30} />}
        </CardActions>
      </SkeletonPreviewRoot>
    );
  } else {
    contentObj = (
      <SkeletonSnippetRoot
        elevation={0}
        square={true}
        disableTypography
        className={classes.skeletonSnippetRoot}
        image={
          <Box className={classes.skeletonSnippetImage}>
            <Skeleton animation={skeletonsAnimation} variant="rectangular" width={100} height={60} /> <Icon fontSize="large">CalendarIcon</Icon>
          </Box>
        }
        primary={<Skeleton animation={skeletonsAnimation} variant="rectangular" height={10} width="40%" style={{marginBottom: 12}} />}
        secondary={
          <>
            <Skeleton animation={skeletonsAnimation} variant="rectangular" height={10} width="60%" style={{marginBottom: 10, marginRight: 5}} />
            <Skeleton animation={skeletonsAnimation} variant="rectangular" height={10} width="35%" />
          </>
        }
        actions={
          <>
            {actions !== undefined ? (
              actions
            ) : (
              <Button size="small" variant="outlined" disabled>
                <Skeleton animation={skeletonsAnimation} height={10} width={30} style={{marginTop: 5, marginBottom: 5}} />
              </Button>
            )}
          </>
        }
      />
    );
  }
  return (
    <Root className={classNames(classes.root, className, `${PREFIX}-skeleton-${template}`)} {...rest}>
      {contentObj}
    </Root>
  );
}
