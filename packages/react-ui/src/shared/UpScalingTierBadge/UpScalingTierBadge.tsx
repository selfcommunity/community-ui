import type {Meta, StoryObj} from '@storybook/react';
import SCUpScalingTierBadge from './index';

export default {
  title: 'Design System/React UI Shared/SCUpScalingTierBadge',
  component: SCUpScalingTierBadge
} as Meta<typeof SCUpScalingTierBadge>;

const template = (args) => <SCUpScalingTierBadge {...args} />;

export const Base: StoryObj<typeof SCUpScalingTierBadge> = {
  render: template
};
