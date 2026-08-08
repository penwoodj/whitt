import type { Meta, StoryObj } from '@storybook/react'
import { ProjectFolderPicker } from './ProjectFolderPicker'

const meta = {
  title: 'Settings/ProjectFolderPicker',
  component: ProjectFolderPicker,
  tags: ['autodocs'],
} satisfies Meta<typeof ProjectFolderPicker>

export default meta
type Story = StoryObj<typeof ProjectFolderPicker>

export const Default: Story = {
  args: {
    folderPath: '',
    onChange: () => {},
  },
}

export const WithPath: Story = {
  args: {
    folderPath: '/home/jon/projects/whitt',
    onChange: () => {},
  },
}
