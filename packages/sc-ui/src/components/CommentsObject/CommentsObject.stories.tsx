import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import CommentsObject from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/core';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/CommentsObject',
  component: CommentsObject,
  argTypes: {
    id: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      defaultValue: 17,
      table: {defaultValue: {summary: 17}}
    },
    feedObjectType: {
      options: [SCFeedObjectTypologyType.POST, SCFeedObjectTypologyType.DISCUSSION, SCFeedObjectTypologyType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.'
    },
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      defaultValue: 1,
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      defaultValue: 'elevation',
      table: {defaultValue: {summary: 'elevation'}}
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CommentsObject>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommentsObject> = (args) => (
  <div style={{width: 800}}>
    <CommentsObject {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  feedObjectType: SCFeedObjectTypologyType.DISCUSSION
};
