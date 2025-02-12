import type { Meta, StoryObj } from '@storybook/react';
import GroupTemplate from './index';

export default {
  title: 'Design System/React TEMPLATES/Group',
  component: GroupTemplate
} as Meta<typeof GroupTemplate>;

export const Base: StoryObj<typeof GroupTemplate> = {
  args: {
    groupId: 3,

  },
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <GroupTemplate {...args} />
    </div>)
};

export const BaseContainerFixed: StoryObj<typeof GroupTemplate> = {
	args: {
		groupId: 3
	},
	render: (args) => {
		return <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, top: 70, zIndex: 1, maxWidth: '100% !important', height: '92vh', overflow: 'auto'}} id="scrollableDiv">
			<GroupTemplate {...args} GroupFeedProps={{FeedProps: {scrollableTargetId: 'scrollableDiv'}}} />
		</div>;
	}
};
