import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import PeopleSuggestionSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Skeleton/PeopleSuggestion',
  component: PeopleSuggestionSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PeopleSuggestionSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PeopleSuggestionSkeleton> = (args) => (
  <div style={{width: 400}}>
    <PeopleSuggestionSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
