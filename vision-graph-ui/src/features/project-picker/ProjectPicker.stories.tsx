import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import ProjectPicker from './ProjectPicker'
import { buildDefaultProps } from './projectPickerData'

const meta: Meta<typeof ProjectPicker> = {
  title: 'Features/ProjectPicker/ProjectPicker',
  component: ProjectPicker,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ProjectPicker>

export const Default: Story = {
  args: buildDefaultProps(),
}

export const Empty: Story = {
  args: {
    projects: [],
    activeProjectId: '',
    onSelect: () => {},
    onNew: () => {},
  },
}
