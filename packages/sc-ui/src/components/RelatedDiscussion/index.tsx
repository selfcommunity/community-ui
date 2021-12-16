import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Divider, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  Endpoints,
  http,
  Logger,
  SCCategoryType,
  SCFeedDiscussionType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCFeedUnitType
} from '@selfcommunity/core';
import TrendingPostSkeleton from '../Skeleton/TrendingFeedSkeleton';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import FeedObject, {FeedObjectTemplateType} from '../FeedObject';
import {FormattedMessage} from 'react-intl';
import Category from '../Category';

const PREFIX = 'SCTrendingPost';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 500,
  marginBottom: theme.spacing(2)
}));

function RelatedDiscussion({
  feedObjectId = null,
  feedObjectType = null,
  template = null,
  ...props
}: {
  feedObjectId?: number;
  feedObjectType?: SCFeedObjectTypologyType;
  template?: FeedObjectTemplateType;
}): JSX.Element {
  const [objs, setObjs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [visibleDiscussions, setVisibleDiscussions] = useState<number>(4);
  const [openTrendingPostDialog, setOpenTrendingPostDialog] = useState<boolean>(false);

  function fetchRelated() {
    http
      .request({
        url: Endpoints.RelatedDiscussion.url({type: feedObjectType, id: feedObjectId}),
        method: Endpoints.RelatedDiscussion.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setObjs(data.results);
        setHasMore(data.count > visibleDiscussions);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  function loadDiscussions() {
    setVisibleDiscussions((prevVisibleDiscussions) => prevVisibleDiscussions + 4);
  }

  useEffect(() => {
    fetchRelated();
  }, []);

  return (
    <Root {...props}>
      {loading ? (
        <TrendingPostSkeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography variant="body1">
            <FormattedMessage id="ui.RelatedDiscussion.title" defaultMessage="ui.RelatedDiscussion.title" />
          </Typography>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.TrendingPost.noResults" defaultMessage="ui.TrendingPost.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {objs.slice(0, visibleDiscussions).map((obj: SCFeedDiscussionType, index) => (
                  <div key={index}>
                    <FeedObject elevation={0} feedObject={obj} key={obj.id} template={template} />
                  </div>
                ))}
              </List>
              {hasMore && (
                <Button size="small" onClick={() => loadDiscussions()}>
                  <FormattedMessage id="ui.TrendingPost.button.showMore" defaultMessage="ui.TrendingPost.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openTrendingPostDialog && <></>}
        </CardContent>
      )}
    </Root>
  );
}
export default RelatedDiscussion;
