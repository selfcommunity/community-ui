import type { Meta, StoryObj } from '@storybook/react';
import { SCLiveStreamTemplateType } from '../../types/liveStream';
import LiveStream from './index';

export default {
	title: 'Design System/React UI/LiveStream/LiveStream',
	component: LiveStream,
	argTypes: {
		liveStreamId: {
			control: { type: 'number' },
			description: 'LiveStream Id',
			table: { defaultValue: { summary: 1 } }
		},
		elevation: {
			control: { type: 'number' },
			description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
			table: { defaultValue: { summary: 1 } }
		},
		variant: {
			options: ['elevation', 'outlined'],
			control: { type: 'select' },
			description: 'The variant to use. Types: "elevation", "outlined", etc.',
			table: { defaultValue: { summary: 'elevation' } }
		}
	}
} as Meta<typeof LiveStream>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<LiveStream {...args} />
	</div>
);

export const Base: StoryObj<typeof LiveStream> = {
	args: {
		liveStreamId: 2,
	},
	render: template
};

export const Snippet: StoryObj<typeof LiveStream> = {
	args: {
		liveStreamId: 2,
		elevation: 0,
		variant: 'elevation',
		square: false
	},
	render: template
};

export const Detail: StoryObj<typeof LiveStream> = {
	args: {
		liveStreamId: 2,
		elevation: 0,
		variant: 'elevation',
		square: false,
		template: SCLiveStreamTemplateType.DETAIL,
		actions: <></>
	},
	render: template
};

export const DetailCard: StoryObj<typeof LiveStream> = {
	args: {
		liveStreamId: 2,
		template: SCLiveStreamTemplateType.DETAIL,
	},
	render: template
};

export const Preview: StoryObj<typeof LiveStream> = {
	args: {
		liveStreamId: 2,
		elevation: 0,
		variant: 'elevation',
		square: false,
		template: SCLiveStreamTemplateType.PREVIEW,
	},
	render: template
};

export const PreviewCard: StoryObj<typeof LiveStream> = {
	args: {
		liveStreamId: 2,
		template: SCLiveStreamTemplateType.PREVIEW,
	},
	render: template
};
