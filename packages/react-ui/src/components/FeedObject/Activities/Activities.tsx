import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {SCCommentsOrderBy} from '../../../types/comments';
import classNames from 'classnames';
import CommentsObject, {CommentsObjectProps} from '../../CommentsObject';
import ActivitiesMenu from './ActivitiesMenu';
import {CommentObjectProps} from '../../CommentObject';
import RelevantActivities from './RelevantActivities';
import {SCFeedObjectActivitiesType} from '../../../types/feedObject';
import {useSCFetchCommentObjects} from '@selfcommunity/react-core';
import {SCCommentType, SCContributionType, SCFeedObjectType} from '@selfcommunity/types';
import {CacheStrategies} from '@selfcommunity/utils';
import {useInView} from 'react-intersection-observer';
import {PREFIX} from '../constants';

const classes = {
  root: `${PREFIX}-activities-root`,
  activities: `${PREFIX}-activities`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ActivitiesRoot'
})(() => ({}));

export interface ActivitiesProps {
  /**
   * Id of the FeedObjectActivities
   * @default `feed_object_activities_<feedObjectId | feedObject.id>`
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Id of feed object
   * @default null
   */
  feedObjectId?: number;

  /**
   * Feed object
   * @default null
   */
  feedObject?: SCFeedObjectType;

  /**
   * Type of feed object
   * @default SCContributionType.POST
   */
  feedObjectType?: Exclude<SCContributionType, SCContributionType.COMMENT>;

  /**
   * Feed Object latest activities
   * @default null
   */
  feedObjectActivities?: any[];

  /**
   * Comments (if new)
   * @default []
   */
  comments?: SCCommentType[];

  /**
   * Activities type
   * @default SCFeedObjectActivitiesType.RECENT_COMMENTS
   */
  activitiesType?: SCFeedObjectActivitiesType;

  /**
   * Callback change activities type
   */
  onSetSelectedActivities?: (type: SCFeedObjectActivitiesType) => void;

  /**
   * Props to spread to comments object skeleton
   * @default {elevation: 0, WidgetProps: {variant: 'outlined'} as WidgetProps}
   */
  CommentsObjectProps?: CommentsObjectProps;

  /**
   * Props to spread to comments object skeleton
   * @default {variant: 'oulined'}
   */
  CommentComponentProps?: CommentObjectProps;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function Activities(props: ActivitiesProps): JSX.Element {
  // PROPS
  const {
    id = `feed_object_activities_${props.feedObjectId ? props.feedObjectId : props.feedObject ? props.feedObject.id : ''}`,
    className,
    feedObjectId,
    feedObject,
    feedObjectType = SCContributionType.POST,
    cacheStrategy = CacheStrategies.CACHE_FIRST,
    CommentsObjectProps = {},
    CommentComponentProps = {variant: 'outlined'},
    feedObjectActivities = [],
    comments = [],
    onSetSelectedActivities,
    activitiesType = SCFeedObjectActivitiesType.RECENT_COMMENTS,
    ...rest
  } = props;

  const {ref, inView} = useInView({triggerOnce: true});

  // STATE
  const [selectedActivities, setSelectedActivities] = useState<SCFeedObjectActivitiesType>(activitiesType);

  const commentsObject = useSCFetchCommentObjects({
    id: feedObjectId,
    feedObject,
    feedObjectType,
    cacheStrategy,
    pageSize: 1,
    orderBy:
      selectedActivities === SCFeedObjectActivitiesType.CONNECTIONS_COMMENTS
        ? SCCommentsOrderBy.CONNECTION_DESC
        : selectedActivities === SCFeedObjectActivitiesType.FIRST_COMMENTS
        ? SCCommentsOrderBy.ADDED_AT_ASC
        : SCCommentsOrderBy.ADDED_AT_DESC
  });

  const objId = commentsObject.feedObject ? commentsObject.feedObject.id : null;
  const skeletonsCount = Math.min(2, commentsObject.feedObject ? commentsObject.feedObject.comment_count : 2);
  const existFeedObjectActivities = feedObjectActivities && feedObjectActivities.length > 0;

  /**
   * Sync activities type if prop change
   */
  useEffect(() => {
    setSelectedActivities(activitiesType);
  }, [activitiesType]);

  /**
   * Prefetch comments only if obj
   */
  useEffect(() => {
    if (objId && !commentsObject.comments.length && inView) {
      commentsObject.getNextPage();
    }
  }, [objId, inView]);

  /**
   * Handle change activities type
   * @param type
   */
  function handleSelectActivitiesType(type: SCFeedObjectActivitiesType) {
    onSetSelectedActivities(type);
    setSelectedActivities(type);
  }

  /**
   * Render latest activities of feedObject
   */
  function renderRelevantActivities() {
    return <RelevantActivities activities={feedObjectActivities} />;
  }

  /**
   * Load comments
   */
  function handleNext() {
    commentsObject.getNextPage();
  }

  /**
   * Render comments of feedObject
   */
  function renderComments() {
    return (
      <>
        {(commentsObject.feedObject.comment_count > 0 || comments.length > 0) && (
          <CommentsObject
            feedObject={commentsObject.feedObject}
            comments={commentsObject.comments}
            startComments={comments}
            next={commentsObject.next}
            isLoadingNext={commentsObject.isLoadingNext}
            handleNext={handleNext}
            totalLoadedComments={commentsObject.comments.length + comments.length}
            totalComments={commentsObject.feedObject.comment_count}
            hideAdvertising
            {...CommentsObjectProps}
            cacheStrategy={cacheStrategy}
            CommentsObjectSkeletonProps={{count: skeletonsCount}}
            CommentComponentProps={{
              ...(CommentsObjectProps.CommentComponentProps ? CommentsObjectProps.CommentComponentProps : {}),
              ...{truncateContent: true},
              ...CommentComponentProps,
              ...{cacheStrategy}
            }}
            inPlaceLoadMoreContents={false}
          />
        )}
      </>
    );
  }

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest} ref={ref}>
      {commentsObject.feedObject &&
      (Boolean(commentsObject.feedObject.comment_count) ||
        (feedObjectActivities && feedObjectActivities.length > 0) ||
        comments.length > 0 ||
        (feedObject && feedObject.comment_count > 0)) ? (
        <Box
          className={classes.activities}
          {...(existFeedObjectActivities ? {} : {style: {minHeight: `${Math.min(skeletonsCount, feedObject.comment_count) * 80}px`}})}>
          <ActivitiesMenu
            selectedActivities={selectedActivities}
            hideRelevantActivitiesItem={!existFeedObjectActivities}
            onChange={handleSelectActivitiesType}
          />
          {selectedActivities === SCFeedObjectActivitiesType.RELEVANCE_ACTIVITIES ? renderRelevantActivities() : renderComments()}
        </Box>
      ) : null}
    </Root>
  );
}
