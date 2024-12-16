import type { Meta, StoryObj } from '@storybook/react';
import EventSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/LiveStream',
  component: EventSkeleton
} as Meta<typeof EventSkeleton>;

const template = (args) => (
  <div style={{ width: '50%' }}>
    <EventSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof EventSkeleton> = {
  render: template
};
