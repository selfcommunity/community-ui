import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Divider, Typography, List} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCPrivateMessageType} from '@selfcommunity/core/src/types';
import {FormattedMessage} from 'react-intl';
import SnippetsSkeleton from './Skeleton';
import Message from '../Message';
import classNames from 'classnames';

const PREFIX = 'SCSnippets';

const classes = {
  root: `${PREFIX}-root`,
  selected: `${PREFIX}-selected`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.selected}`]: {
    background: '#9dd4af'
  }
}));

export interface SnippetsProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
  /**
   * *Callback on snippet click
   * @param msg
   */
  onSnippetClick?: (msg) => void;
  threadId?: number;
}
/**
 *
 > API documentation for the Community-UI Snippets component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import Snippets from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCSnippets` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCSnippets-root|Styles applied to the root element.|
 |selected|.SCSnippets-selected|Styles applied to the selected element.|

 * @param props
 */
export default function Snippets(props: SnippetsProps): JSX.Element {
  // PROPS
  const {autoHide = false, className = null, onSnippetClick, threadId, ...rest} = props;

  // STATE
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [unseen, setUnseen] = useState<boolean>(null);

  /**
   * Fetches Snippets
   */
  function fetchSnippets() {
    http
      .request({
        url: Endpoints.GetSnippets.url(),
        method: Endpoints.GetSnippets.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setSnippets(data.results);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * On mount, fetches snippets
   */
  useEffect(() => {
    fetchSnippets();
  }, []);

  /**
   * Handles thread opening
   */
  function handleOpenThread(msg) {
    onSnippetClick(msg);
    setUnseen(false);
  }

  /**
   * Renders snippets list
   */
  const c = (
    <React.Fragment>
      {loading ? (
        <SnippetsSkeleton elevation={0} />
      ) : (
        <CardContent>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.categoriesSuggestion.noResults" defaultMessage="ui.categoriesSuggestion.noResults" />
            </Typography>
          ) : (
            <List>
              {snippets.map((message: SCPrivateMessageType, index) => (
                <div key={index}>
                  <Message
                    elevation={0}
                    message={message}
                    key={message.id}
                    onClick={() => handleOpenThread(message)}
                    unseen={unseen === null ? message.thread_status === 'new' : unseen}
                    className={message.id === threadId ? classes.selected : ''}
                  />
                  {index < total - 1 ? <Divider /> : null}
                </div>
              ))}
            </List>
          )}
        </CardContent>
      )}
    </React.Fragment>
  );

  /**
   * Renders the component (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
        {c}
      </Root>
    );
  }
  return null;
}
