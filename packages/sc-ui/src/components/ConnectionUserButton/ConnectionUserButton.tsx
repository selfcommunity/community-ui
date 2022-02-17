import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import {SCPreferences, SCPreferencesContext, SCPreferencesContextType, SCUserType} from '@selfcommunity/core';
import {Box} from '@mui/material';
import FollowUserButton, {FollowUserButtonProps} from '../FollowUserButton';
import FriendshipUserButton, {FriendshipButtonProps} from '../FriendshipUserButton';

const PREFIX = 'SCConnectionUserButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface ConnectionUserButtonProps {
  /**
   * User Object
   * @default null
   */
  user?: SCUserType;
  /**
   * Props to spread to follow/friendship button
   * @default {}
   */
  followConnectUserButtonProps?: FollowUserButtonProps | FriendshipButtonProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function ConnectionUserButton(props: ConnectionUserButtonProps): JSX.Element {
  // PROPS
  const {user = null, followConnectUserButtonProps = {}, ...rest} = props;

  // CONTEXT
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

  return (
    <React.Fragment>
      {followEnabled ? (
        <FollowUserButton user={user} {...followConnectUserButtonProps} {...rest} />
      ) : (
        <FriendshipUserButton user={user} {...followConnectUserButtonProps} {...rest} />
      )}
    </React.Fragment>
  );
}
