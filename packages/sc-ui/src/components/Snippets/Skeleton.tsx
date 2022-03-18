import React from 'react';
import Widget from '../Widget';
import List from '@mui/material/List';
import {styled} from '@mui/material/styles';
import SnippetMessageBoxSkeleton from '../Message/Skeleton';
import {CardContent} from '@mui/material';

const PREFIX = 'SCSnippetsSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({
  maxWidth: 700,
  [`& .${classes.list}`]: {
    marginLeft: -16,
    marginRight: -16
  }
}));

export default function SnippetsSkeleton(props): JSX.Element {
  return (
    <Root className={classes.root} {...props}>
      <CardContent>
        <List className={classes.list}>
          {[...Array(4)].map((category, index) => (
            <SnippetMessageBoxSkeleton key={index} elevation={0} />
          ))}
        </List>
      </CardContent>
    </Root>
  );
}
