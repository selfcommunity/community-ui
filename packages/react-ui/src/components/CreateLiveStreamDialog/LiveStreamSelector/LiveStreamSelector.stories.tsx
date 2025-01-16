import type { Meta, StoryObj } from '@storybook/react';
import LiveStreamSelector from './LiveStreamSelector';

export default {
  title: 'Design System/React UI/Livestream/LiveStreamSelector ',
  component: LiveStreamSelector,
} as Meta<typeof LiveStreamSelector>;

const template = (args) => (
  <div style={{width: 800}}>
    <LiveStreamSelector {...args} />
  </div>
);


export const Base: StoryObj<typeof LiveStreamSelector> = {
  args: {},
  render: template
};
