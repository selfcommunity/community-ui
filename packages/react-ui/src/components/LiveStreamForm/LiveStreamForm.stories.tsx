import type { Meta, StoryObj } from '@storybook/react';
import LiveStreamForm from './index';

export default {
  title: 'Design System/React UI/Livestream/LiveStreamForm',
  component: LiveStreamForm,
} as Meta<typeof LiveStreamForm>;

const template = (args) => (
  <div style={{maxWidth: 800}}>
    <LiveStreamForm {...args} />
  </div>
);


export const Base: StoryObj<typeof LiveStreamForm> = {
  args: {},
  render: template
};
