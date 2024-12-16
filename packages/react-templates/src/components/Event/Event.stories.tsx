import type { Meta, StoryObj } from '@storybook/react';
import EventTemplate from './index';

export default {
  title: 'Design System/React TEMPLATES/Event',
  component: EventTemplate,
	argTypes: {
		eventId: {
			control: {type: 'number'},
			description: 'Event Id'
		}
	},
} as Meta<typeof EventTemplate>;

export const Base: StoryObj<typeof EventTemplate> = {
  args: {
    eventId: 121,

  },
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <EventTemplate {...args} />
    </div>)
};

export const BaseContainerFixed: StoryObj<typeof EventTemplate> = {
	args: {
		eventId: 121
	},
	render: (args) => {
		return <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, top: 70, zIndex: 1, maxWidth: '100% !important', height: '92vh', overflow: 'auto'}} id="scrollableDiv">
			<EventTemplate {...args} EventFeedProps={{FeedProps: {scrollableTargetId: 'scrollableDiv'}}} />
		</div>;
	}
};
