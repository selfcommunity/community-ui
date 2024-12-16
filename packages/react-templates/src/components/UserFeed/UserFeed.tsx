import React, {useMemo, useRef} from 'react';
import {styled} from '@mui/material/styles';
import {Endpoints} from '@selfcommunity/api-services';
import {SCUserContextType, useSCFetchUser, useSCUser} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import {
  Feed,
  FeedObject,
  FeedObjectProps,
  FeedObjectSkeleton,
  FeedProps,
  FeedRef,
  FeedSidebarProps,
  InlineComposerWidget,
  SCFeedObjectTemplateType,
  SCFeedWidgetType,
  UserFollowedCategoriesWidget,
  UserFollowedUsersWidget,
  UserFollowersWidget,
  UserLiveStreamWidget
} from '@selfcommunity/react-ui';
import {UserFeedSkeleton} from './index';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {useSnackbar} from 'notistack';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Feed, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface UserFeedProps {
  /**
   * Id of the feed object
   * @default 'user_feed'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Id of the user for filter the feed
   * @default null
   */
  userId?: number;

  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  /**
   * Widgets to be rendered into the feed
   * @default [UserFollowedCategoriesWidget, UserFollowedUsersWidget]
   */
  widgets?: SCFeedWidgetType[] | null;

  /**
   * Props to spread to single feed object
   * @default empty object
   */
  FeedObjectProps?: FeedObjectProps;

  /**
   * Props to spread to single feed object
   * @default {top: 0, bottomBoundary: `#${id}`}
   */
  FeedSidebarProps?: FeedSidebarProps;

  /**
   * Props to spread to feed component
   * @default {}
   */
  FeedProps?: Omit<
    FeedProps,
    'endpoint' | 'widgets' | 'ItemComponent' | 'itemPropsGenerator' | 'itemIdGenerator' | 'ItemSkeleton' | 'ItemSkeletonProps' | 'FeedSidebarProps'
  >;
}

// Widgets for feed
const WIDGETS: SCFeedWidgetType[] = [
  {
    type: 'widget',
    component: UserLiveStreamWidget,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: UserFollowedCategoriesWidget,
    componentProps: {},
    column: 'right',
    position: 1
  },
  {
    type: 'widget',
    component: UserFollowedUsersWidget,
    componentProps: {},
    column: 'right',
    position: 2
  },
  {
    type: 'widget',
    component: UserFollowersWidget,
    componentProps: {},
    column: 'right',
    position: 3
  }
];

/**
 * > API documentation for the Community-JS User Feed Template. Learn about the available props and the CSS API.
 *
 *
 * This component renders a specific user's feed template.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-templates/Components/UserFeed)

 #### Import

 ```jsx
 import {UserFeed} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCUserFeedTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserFeedTemplate-root|Styles applied to the root element.|
 *
 * @param inProps
 */
export default function UserFeed(inProps: UserFeedProps): JSX.Element {
  // PROPS
  const props: UserFeedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'user_feed', className, userId, user, widgets = WIDGETS, FeedObjectProps = {}, FeedSidebarProps = null, FeedProps = {}} = props;

  // Context
  const scUserContext: SCUserContextType = useSCUser();
  const {enqueueSnackbar} = useSnackbar();

  // Hooks
  const {scUser} = useSCFetchUser({id: userId, user});

  // REF
  const feedRef = useRef<FeedRef>();

  // HANDLERS
  const handleComposerSuccess = (feedObject) => {
    enqueueSnackbar(<FormattedMessage id="ui.inlineComposerWidget.success" defaultMessage="ui.inlineComposerWidget.success" />, {
      variant: 'success',
      autoHideDuration: 3000
    });
    // Hydrate feedUnit
    const feedUnit = {
      type: feedObject.type,
      [feedObject.type]: feedObject,
      seen_by_id: [],
      has_boost: false
    };
    feedRef && feedRef.current && feedRef.current.addFeedData(feedUnit, true);
  };

  // WIDGETS
  const _widgets = useMemo(
    () =>
      widgets.map((w) => {
        return {...w, componentProps: {...w.componentProps, userId: scUser ? scUser.id : userId}};
      }),
    [scUser, widgets]
  );

  if (scUser === null) {
    return <UserFeedSkeleton />;
  }

  return (
    <Root
      id={id}
      className={classNames(classes.root, className)}
      ref={feedRef}
      endpoint={{
        ...Endpoints.UserFeed,
        url: () => Endpoints.UserFeed.url({id: scUser.id})
      }}
      widgets={_widgets}
      ItemComponent={FeedObject}
      itemPropsGenerator={(scUser, item) => ({
        feedObject: item[item.type],
        feedObjectType: item.type,
        feedObjectActivities: item.activities ? item.activities : null
      })}
      itemIdGenerator={(item) => item[item.type].id}
      ItemProps={FeedObjectProps}
      ItemSkeleton={FeedObjectSkeleton}
      ItemSkeletonProps={{
        template: SCFeedObjectTemplateType.PREVIEW
      }}
      {...(scUserContext.user ? {HeaderComponent: <InlineComposerWidget onSuccess={handleComposerSuccess} />} : {})}
      FeedSidebarProps={FeedSidebarProps}
      {...FeedProps}
    />
  );
}
