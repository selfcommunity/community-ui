import type { Meta, StoryObj } from '@storybook/react';
import CourseContentMenu from './index';

export default {
  title: 'Design System/React UI/Course Content Menu',
  component: CourseContentMenu
} as Meta<typeof CourseContentMenu>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <CourseContentMenu {...args}></CourseContentMenu>
  </div>
);

export const Base: StoryObj<typeof CourseContentMenu> = {
  args: {},
  render: template
};
