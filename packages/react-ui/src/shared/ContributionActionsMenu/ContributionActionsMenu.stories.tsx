import type { Meta, StoryObj } from '@storybook/react';
import ContributionActionsMenu from './index';
import {SCContributionType} from '@selfcommunity/types';

export default {
  title: 'Design System/React UI Shared/ContributionActionsMenu',
  component: ContributionActionsMenu,
  argTypes: {
    feedObjectId: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      table: {defaultValue: {summary: 379}}
    },
    feedObjectType: {
      options: [SCContributionType.POST, SCContributionType.DISCUSSION, SCContributionType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.'
    }
  },
  args: {
    feedObjectId: 379, // 9,
    feedObjectType: SCContributionType.POST
  }
} as Meta<typeof ContributionActionsMenu>;

const template = (args) => <ContributionActionsMenu {...args} />;

export const Base: StoryObj<typeof ContributionActionsMenu> = {
  render: template
};
