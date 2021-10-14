import React, { useContext, useEffect, useState } from 'react'
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { SCUserBoxSkeleton } from '../SCSkeleton';
import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import {
  SCContext, SCContextType,
  Endpoints, http, SCPreferences,
  SCAuthContext,
  SCAuthContextType,
  SCUserType,
} from '@selfcommunity/core';

const PREFIX = 'SCUser';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export default function SCUser({scUserId = null, scUser= null, contained = true}: {scUserId?: number, scUser?: SCUserType, contained: boolean}): JSX.Element {
  const [user, setUser] = useState<SCUserType>(scUser);
  const scContext: SCContextType = useContext(SCContext);
  const scAuthContext: SCAuthContextType = useContext(SCAuthContext);
  console.log(scContext);
  const followEnabled = SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scContext.preferences && scContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value
  const connectionEnabled = !followEnabled;

  /**
   * If user not in props, attempt to get the user by id (in props) if exist
   */
  function fetchUser() {
    http
      .request({
        url: Endpoints.User.url({id: scUserId}),
        method: Endpoints.User.method
      })
      .then((res) => {
        const data = res.data;
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Render follow action
   * @return {JSX.Element}
   */
  function renderFollowActions() {
    /* TODO: render proper action based on redux connection (follow) store */
    return (
      <React.Fragment>
        <Button size="small" onClick={this.ignore}>
          Ignore
        </Button>
        <Button size="small" variant="outlined" onClick={this.follow}>
          Follow
        </Button>
      </React.Fragment>
    );
  }

  /**
   * Render connection actions
   * @return {JSX.Element}
   */
  function renderConnectionActions() {
    /* TODO: render proper action based on redux connection (friendship) store */
    return (
      <React.Fragment>
        <Button size="small" onClick={this.ignore}>
          Ignore
        </Button>
        <Button size="small" variant="outlined" onClick={this.requestConnect}>
          Connect
        </Button>
      </React.Fragment>
    );
  }

  /**
   * Render authenticated actions
   * @return {JSX.Element}
   */
  function renderAuthenticatedActions() {
    return (
      <React.Fragment>
        {followEnabled ? renderFollowActions() : <React.Fragment>{connectionEnabled ? renderConnectionActions() : null}</React.Fragment>}
      </React.Fragment>
    );
  }

  /**
   * Render anonymous actions
   * @return {JSX.Element}
   */
  function renderAnonymousActions() {
    return (
      <Button size="small">
        Go to Profile
      </Button>
    );
  }

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  const u = (
    <React.Fragment>
      {user ? (
        <ListItem button={true}>
          <ListItemAvatar>
            <Avatar alt={user.username} src={user.avatar} />
          </ListItemAvatar>
          <ListItemText primary={user.username} secondary={user.slogan} />
          <ListItemSecondaryAction>
            {scAuthContext.user && connectionEnabled
              ? renderAuthenticatedActions()
              : renderAnonymousActions()}
          </ListItemSecondaryAction>
        </ListItem>
      ) : (
        <SCUserBoxSkeleton contained />
      )}
    </React.Fragment>
  );

  if (contained) {
    return (
      <Root variant="outlined">
        <CardContent>
          <List>{u}</List>
        </CardContent>
      </Root>
    );
  }
  return u;
}
