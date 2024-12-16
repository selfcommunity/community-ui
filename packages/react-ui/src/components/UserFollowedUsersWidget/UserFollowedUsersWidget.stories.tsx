import type { Meta, StoryObj } from '@storybook/react';
import UserProfileFollowedUsersWidget from './index';

export default {
  title: 'Design System/React UI/User Followed Users Widget',
  component: UserProfileFollowedUsersWidget,
  argTypes: {
    userId: {
      control: {type: 'number'},
      description: 'User Id',
      table: {defaultValue: {summary: 1}}
    }
  }
} as Meta<typeof UserProfileFollowedUsersWidget>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserProfileFollowedUsersWidget {...args} />
  </div>
);


export const Base: StoryObj<typeof UserProfileFollowedUsersWidget> = {
  args: {
    userId: 1
  },
  render: template
};
