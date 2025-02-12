import type { Meta, StoryObj } from '@storybook/react';
import FeedObjectDetailTemplate from './index';
import { CacheStrategies } from '@selfcommunity/utils';
import { SCContributionType } from '@selfcommunity/types';

export default {
  title: 'Design System/React TEMPLATES/Feed Object Detail',
  component: FeedObjectDetailTemplate
} as Meta<typeof FeedObjectDetailTemplate>;

const template = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <FeedObjectDetailTemplate {...args} />
  </div>);

const templateContainerFixed = (args) => (
	<div style={{position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1, maxWidth: '1200px', height: '92vh', overflow: 'auto', paddingLeft: 20, paddingRight: 20}} id="scrollableDiv">
		<FeedObjectDetailTemplate {...args} />
	</div>);

export const Base: StoryObj<typeof FeedObjectDetailTemplate> = {
  args: {
    //    feedObjectId: 2959 evento inattivo,
    feedObjectId: 3097,
    feedObjectType: SCContributionType.POST
	},
  render: template
};

export const BaseContainerFixed: StoryObj<typeof FeedObjectDetailTemplate> = {
	args: {
		feedObjectId: 2936,
		feedObjectType: SCContributionType.DISCUSSION,
		CommentsFeedObjectProps: {cacheStrategy: CacheStrategies.STALE_WHILE_REVALIDATE}
	},
	render: templateContainerFixed
};

export const BaseCacheSWR: StoryObj<typeof FeedObjectDetailTemplate> = {
  args: {
    feedObjectId: 360,
    feedObjectType: SCContributionType.POST,
    FeedObjectProps: {cacheStrategy: CacheStrategies.STALE_WHILE_REVALIDATE},
    CommentsFeedObjectProps: {cacheStrategy: CacheStrategies.STALE_WHILE_REVALIDATE}
  },
  render: template
};

export const BasePagination: StoryObj<typeof FeedObjectDetailTemplate> = {
  args: {
    feedObjectId: 360,
    feedObjectType: SCContributionType.POST,
    CommentsFeedObjectProps: {page: 3}
  },
  render: template
};

export const CommentFirstLevel: StoryObj<typeof FeedObjectDetailTemplate> = {
  args: {
    feedObjectId: 412,
    feedObjectType: SCContributionType.POST,
    CommentsFeedObjectProps: {commentObjectId: 1205}
  },
  render: template
};

export const CommentSecondLevel: StoryObj<typeof FeedObjectDetailTemplate> = {
  args: {
    feedObjectId: 412,
    feedObjectType: SCContributionType.POST,
    CommentsFeedObjectProps: {commentObjectId: 1205}
  },
  render: template
};
