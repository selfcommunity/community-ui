import type { Meta, StoryObj } from '@storybook/react';
import { UserLiveStreamWidgetSkeleton } from './index';

export default {
  title: 'Design System/React UI/Skeleton/UserLiveStreamWidget',
  component: UserLiveStreamWidgetSkeleton,
} as Meta<typeof UserLiveStreamWidgetSkeleton>;

const template = (args) => (
	<div style={{width: 400}}>
		<UserLiveStreamWidgetSkeleton {...args} />
	</div>
);

export const Base: StoryObj<typeof UserLiveStreamWidgetSkeleton> = {
	render: template
};
