import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Widget from '../Widget';
import {useTheme} from '@mui/material';
import {SCThemeType} from '@selfcommunity/react-core';
import Icon from '@mui/material/Icon';

const PREFIX = 'SCPrivateMessageSnippetItemSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  list: `${PREFIX}-list`
};

const Root = styled(Widget)(({theme}) => ({
  maxWidth: 700
}));
/**
 * > API documentation for the Community-JS PrivateMessageSnippetItem Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageSnippetItemSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageSnippetItemSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageSnippetItemSkeleton-root|Styles applied to the root element.|
 |list|.SCPrivateMessageSnippetItemSkeleton-list|Styles applied to the list element.|
 *
 */
export default function PrivateMessageSnippetItemSkeleton(props): JSX.Element {
  const theme = useTheme<SCThemeType>();
  const m = (
    <ListItem secondaryAction={<Icon>more_vert</Icon>}>
      <ListItemAvatar>
        <Skeleton
          animation="wave"
          variant="circular"
          width={theme.selfcommunity.user.avatar.sizeMedium}
          height={theme.selfcommunity.user.avatar.sizeMedium}
        />
      </ListItemAvatar>
      <ListItemText
        primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
        secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
      />
    </ListItem>
  );
  return (
    <Root className={classes.root} {...props}>
      <List>{m}</List>
    </Root>
  );
}
