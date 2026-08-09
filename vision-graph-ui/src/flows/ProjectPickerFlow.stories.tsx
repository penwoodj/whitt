import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../shared/ThemeProvider'
import ProjectPicker from '../features/project-picker/ProjectPicker'
import NewProjectModal from '../features/new-project-modal/NewProjectModal'
import { buildSampleProjects } from '../features/project-picker/projectPickerData'

const meta: Meta<typeof ProjectPicker> = {
  title: 'Flows/ProjectPicker',
  component: ProjectPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ProjectPicker>

export default meta
type Story = StoryObj<typeof ProjectPicker>

const FlowWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </div>
)

export const Default: Story = {
  render: () => (
    <ThemeProvider>
      <FlowWrapper>
        <div style={{ display: 'flex', gap: '16px' }}>
          <ProjectPicker
            projects={buildSampleProjects()}
            activeProjectId=""
            onSelect={() => {}}
            onNew={() => {}}
          />
          <NewProjectModal
            isOpen
            onCreate={() => {}}
            onCancel={() => {}}
          />
        </div>
      </FlowWrapper>
    </ThemeProvider>
  ),
}
