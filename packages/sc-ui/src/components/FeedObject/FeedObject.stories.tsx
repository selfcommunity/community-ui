import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import FeedObject from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/core';
import {SCFeedObjectTemplateType} from '../../types/feedObject';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/FeedObject',
  component: FeedObject,
  argTypes: {
    feedObjectId: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      table: {defaultValue: {summary: 9}}
    },
    feedObjectType: {
      options: [SCFeedObjectTypologyType.POST, SCFeedObjectTypologyType.DISCUSSION, SCFeedObjectTypologyType.STATUS],
      control: {type: 'select'},
      description: 'Object type. Used only with args id.'
    },
    template: {
      options: [SCFeedObjectTemplateType.SNIPPET, SCFeedObjectTemplateType.PREVIEW, SCFeedObjectTemplateType.DETAIL, SCFeedObjectTemplateType.SHARE],
      control: {type: 'select'},
      description: 'Object template. Used only with args id.',
      table: {defaultValue: {summary: SCFeedObjectTemplateType.SNIPPET}}
    },
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  },
  args: {
    feedObjectId: 392,
    feedObjectType: SCFeedObjectTypologyType.POST,
    template: SCFeedObjectTemplateType.PREVIEW,
    elevation: 0,
    variant: 'outlined'
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof FeedObject>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedObject> = (args) => (
  <div style={{width: '100%', maxWidth: 800}}>
    <FeedObject {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
