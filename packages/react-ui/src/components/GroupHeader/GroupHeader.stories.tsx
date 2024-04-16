import type { Meta, StoryObj } from '@storybook/react';

import GroupHeader from './index';

export default {
  title: 'Design System/React UI/Group Header',
  component: GroupHeader,
  argTypes: {
    groupId: {
      control: {type: 'number'},
      description: 'Group Id'
    }
  },
  args: {
    groupId: 3
  }
} as Meta<typeof GroupHeader>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <GroupHeader {...args} />
  </div>
);

export const Base: StoryObj<typeof GroupHeader> = {
  args: {
    groupId: 3
  },
  render: template
};
