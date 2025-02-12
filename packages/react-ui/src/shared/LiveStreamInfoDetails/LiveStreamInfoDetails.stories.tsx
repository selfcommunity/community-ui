import type { Meta, StoryObj } from '@storybook/react';
import LiveStreamInfoDetails from './index';

export default {
	title: 'Design System/React UI Shared/LiveStreamInfoDetails',
	component: LiveStreamInfoDetails,
	argTypes: {
		liveStreamId: {
			control: { type: 'number' },
			description: 'LiveStream Id',
			table: { defaultValue: { summary: 1 } }
		},
		hasInProgress: {
			control: { type: 'boolean' },
			description: 'Show in progress',
			table: { defaultValue: { summary: false } }
		},
	}
} as Meta<typeof LiveStreamInfoDetails>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<LiveStreamInfoDetails {...args} />
	</div>
);

export const Base: StoryObj<typeof LiveStreamInfoDetails> = {
	args: {
		liveStreamId: 117,
	},
	render: template
};

export const InProgress: StoryObj<typeof LiveStreamInfoDetails> = {
	args: {
		liveStreamId: 117,
		hasInProgress: true
	},
	render: template
};
