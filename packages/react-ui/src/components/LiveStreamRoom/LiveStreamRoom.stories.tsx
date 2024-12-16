import type { Meta, StoryObj } from '@storybook/react';
import LiveStreamRoom from './index';

export default {
  title: 'Design System/React UI/Livestream/LiveStreamRoom',
  component: LiveStreamRoom,
} as Meta<typeof LiveStreamRoom>;

const template = (args) => (
 	<LiveStreamRoom {...args} />
);


export const Base: StoryObj<typeof LiveStreamRoom> = {
  args: {
		liveStreamId: 27
	},
  render: template
};
