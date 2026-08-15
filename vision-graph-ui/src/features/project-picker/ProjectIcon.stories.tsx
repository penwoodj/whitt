import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import ProjectIcon from './ProjectIcon'
import type { ProjectIconProps } from './projectPickerTypes'

const meta: Meta<typeof ProjectIcon> = {
  title: 'Features/ProjectPicker/ProjectIcon',
  component: ProjectIcon,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ProjectIcon>

export const Inactive: Story = {
  args: {
    label: 'Test Project',
    iconLetter: 'T',
    $isActive: false,
    onClick: () => {},
  } as ProjectIconProps,
}

export const Active: Story = {
  args: {
    label: 'Test Project',
    iconLetter: 'T',
    $isActive: true,
    onClick: () => {},
  } as ProjectIconProps,
}

export const APP05TitleInlineEdit: Story = {
  name: 'slice01 -- APP-05 title inline edit',
  args: {
    label: 'Test Project',
    iconLetter: 'T',
    $isActive: false,
    onClick: () => {},
  } as ProjectIconProps,
  parameters: {
    docs: {
      description: {
        story: 'Click on the title to edit it inline. The letter updates to match the new title on blur.',
      },
    },
  },
}
