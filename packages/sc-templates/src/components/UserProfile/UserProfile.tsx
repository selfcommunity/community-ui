import React from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {FeedObjectProps, FeedSidebarProps, SCFeedWidgetType, UserProfileHeader} from '@selfcommunity/ui';
import UserFeed from '../UserFeed';
import {SCUserType, useSCFetchUser} from '@selfcommunity/core';
import UserProfileSkeleton from './Skeleton';

const PREFIX = 'SCUserProfileTemplate';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2)
}));

export interface UserProfileProps {
  /**
   * Id of the user profile
   * @default 'user'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  /**
   * Id of the user for filter the feed
   * @default null
   */
  userId?: number;

  /**
   * Widgets to be rendered into the feed
   * @default [CategoriesFollowed, UserFollowed]
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
}

export default function UserProfile(props: UserProfileProps): JSX.Element {
  // PROPS
  const {id = 'user_profile', className, user, userId, widgets, FeedObjectProps, FeedSidebarProps} = props;

  // Hooks
  const {scUser} = useSCFetchUser({id: userId, user});

  if (scUser === null) {
    return <UserProfileSkeleton />;
  }
  return (
    <Root id={id} className={className}>
      <UserProfileHeader user={scUser} />
      <UserFeed user={scUser} widgets={widgets} FeedObjectProps={FeedObjectProps} FeedSidebarProps={FeedSidebarProps} />
    </Root>
  );
}
