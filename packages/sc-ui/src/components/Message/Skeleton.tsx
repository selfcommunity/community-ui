import React from 'react';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import {Button} from '@mui/material';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

const PREFIX = 'SCMessageSkeleton';

const classes = {
  list: `${PREFIX}-list`
};

const Root = styled(Card)(({theme}) => ({
  maxWidth: 700,
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));

export default function MessageSkeleton(props): JSX.Element {
  const m = (
    <ListItem>
      <ListItemAvatar>
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
        secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
      />
    </ListItem>
  );
  return (
    <Root {...props}>
      <List>{m}</List>
    </Root>
  );
}
