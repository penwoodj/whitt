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

export const APP03ProjectLetterBubbles: Story = {
  name: 'slice01 -- APP-03 project letter bubbles',
  args: {
    projects: [
      { id: '1', label: 'Alpha', iconLetter: 'A', lastOpened: new Date() },
      { id: '2', label: 'Beta', iconLetter: 'B', lastOpened: new Date() },
      { id: '3', label: 'Gamma', iconLetter: 'G', lastOpened: new Date() },
    ],
    activeProjectId: '1',
    onSelect: () => {},
    onNew: () => {},
  },
}

export const APP04NewProjectBlank: Story = {
  name: 'slice01 -- APP-04 new project blank',
  args: {
    projects: [{ id: '1', label: 'Existing', iconLetter: 'E', lastOpened: new Date() }],
    activeProjectId: '',
    onSelect: () => {},
    onNew: () => {},
  },
}

export const APPC02EmptyRail: Story = {
  name: 'slice01 -- APPC-02 empty rail',
  args: {
    projects: [],
    activeProjectId: '',
    onSelect: () => {},
    onNew: () => {},
  },
}

export const APPC01RailScrolls: Story = {
  name: 'slice01 -- APPC-01 rail scrolls',
  args: {
    projects: Array.from({ length: 30 }, (_, i) => ({
      id: `project-${i}`,
      label: `Project ${i}`,
      iconLetter: String.fromCharCode(65 + (i % 26)),
      lastOpened: new Date(),
    })),
    activeProjectId: 'project-25',
    onSelect: () => {},
    onNew: () => {},
  },
}
