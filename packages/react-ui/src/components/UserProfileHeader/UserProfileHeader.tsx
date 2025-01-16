import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Paper, Typography} from '@mui/material';
import ChangeCover, {ChangeCoverProps} from '../ChangeCover';
import ChangePicture, {ChangePictureProps} from '../ChangePicture';
import {SCUserType} from '@selfcommunity/types';
import {
  Link,
  SCContextType,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useSCContext,
  useSCFetchUser,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import UserProfileHeaderSkeleton from './Skeleton';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {PREFIX} from './constants';
import UserAvatar from '../../shared/UserAvatar';

const classes = {
  root: `${PREFIX}-root`,
  cover: `${PREFIX}-cover`,
  avatar: `${PREFIX}-avatar`,
  info: `${PREFIX}-info`,
  infOpsSection: `${PREFIX}-infops-section`,
  username: `${PREFIX}-username`,
  realname: `${PREFIX}-realname`,
  bio: `${PREFIX}-bio`,
  website: `${PREFIX}-website`,
  changePicture: `${PREFIX}-change-picture`,
  changeCover: `${PREFIX}-change-cover`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface UserProfileHeaderProps {
  /**
   * Id of user object
   * @default null
   */
  id?: string;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Id of user object
   * @default null
   */
  userId?: number;

  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  /**
   * Props to spread change picture button
   * @default {}
   */
  ChangePictureProps?: ChangePictureProps;

  /**
   * Props to spread change cover button
   * @default {}
   */
  ChangeCoverProps?: ChangeCoverProps;

  /**
   *
   */
  actions?: React.ReactNode;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS User Profile AppBar component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the user profile's top section.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/UserProfileHeader)

 #### Import

 ```jsx
 import {UserProfileHeader} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserProfileHeader` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileHeader-root|Styles applied to the root element.|
 |cover|.SCUserProfileHeader-cover|Styles applied to the cover element.|
 |avatar|.SCUserProfileHeader-avatar|Styles applied to the avatar element.|
 |infOpsSection|SCUserProfileHeader-infops-section|Styles applied to the section including info and actions.|
 |info|SCUserProfileHeader-info|Styles applied to the info section.|
 |username|SCUserProfileHeader-username|Styles applied to the username element.|
 |realname|SCUserProfileHeader-realname|Styles applied to the realname element.|
 |changePicture|.SCUserProfileHeader-change-picture|Styles applied to changePicture element.|
 |changeCover|.SCUserProfileHeader-change-cover`|Styles applied to changeCover element.|

 * @param inProps
 */
export default function UserProfileHeader(inProps: UserProfileHeaderProps): JSX.Element {
  // PROPS
  const props: UserProfileHeaderProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = null, className = null, userId = null, user = null, ChangePictureProps = {}, ChangeCoverProps = {}, actions, ...rest} = props;

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});

  // CONST
  const isMe = useMemo(() => scUserContext.user && scUser?.id === scUserContext.user.id, [scUserContext.user, scUser]);

  /**
   * Handles Change Avatar
   * Only if scUser.id === scUserContext.user.id
   * If avatar === null reset the avatar with auto-generated image
   * @param avatar
   */
  function handleChangeAvatar(avatar) {
    if (scUser.id === scUserContext.user.id && avatar) {
      setSCUser(Object.assign({}, scUser, {avatar: avatar.avatar}));
    } else {
      setSCUser(Object.assign({}, scUser, {avatar: `${scContext.settings.portal}/api/v2/avatar/${scUser.id}`}));
    }
  }

  /**
   * Handles Change Cover
   * Only if scUser.id === scUserContext.user.id
   * @param cover
   */
  function handleChangeCover(cover) {
    if (scUser.id === scUserContext.user.id) {
      setSCUser(Object.assign({}, scUser, {cover: cover}));
    }
  }

  // RENDER
  if (!scUser) {
    return <UserProfileHeaderSkeleton />;
  }
  const _backgroundCover = {
    ...(scUser.cover
      ? {background: `url('${scUser.cover}') center / cover`}
      : {background: `url('${scPreferences.preferences[SCPreferences.IMAGES_USER_DEFAULT_COVER].value}') center / cover`})
  };
  const realName = (isMe && scUserContext.user.real_name) || scUser.real_name;
  const hasBadge = scUser && scUser.community_badge;
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <Paper style={_backgroundCover} classes={{root: classes.cover}}>
        <Box className={classes.avatar}>
          <UserAvatar hide={!hasBadge}>
            <img src={scUser.avatar ? scUser.avatar : ''} />
          </UserAvatar>
        </Box>
        {isMe && (
          <>
            <ChangePicture iconButton={true} onChange={handleChangeAvatar} className={classes.changePicture} {...ChangePictureProps} />
            <div className={classes.changeCover}>
              <ChangeCover onChange={handleChangeCover} {...ChangeCoverProps} />
            </div>
          </>
        )}
      </Paper>
      <Box className={classes.infOpsSection}>
        <Box className={classes.info}>
          <Typography variant="h5" className={classes.username}>
            @{isMe ? scUserContext.user.username : scUser.username}
          </Typography>
          {realName && (
            <Typography variant="subtitle1" className={classes.realname}>
              {realName}
            </Typography>
          )}
          {scUser.bio && (
            <Typography variant="subtitle2" className={classes.bio}>
              {scUser.bio}
            </Typography>
          )}
          {scUser.website && (
            <Link className={classes.website} target="_blank" to={scUser.website}>
              <Typography variant="body2">{scUser.website}</Typography>
            </Link>
          )}
        </Box>
        {actions && actions}
      </Box>
    </Root>
  );
}
