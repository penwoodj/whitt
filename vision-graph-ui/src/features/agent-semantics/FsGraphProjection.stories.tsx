import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'

function AGT06FsProjectsToGraphStory() {
  return (
    <div style={{ padding: '16px', color: '#fff' }}>
      <h2>AGT-06: FS Projects to Graph</h2>
      <div>
        <h3>File Write → Node Appear/Update</h3>
        <p>When agent writes file via mock agent, corresponding node appears/updates in graph.</p>
        <h3>FS Truth Enforcement</h3>
        <p>When external editor changes file, graph reloads node (FS wins).</p>
        <h3>Loader→Graph Sync</h3>
        <p>fsGraphLoader integrates with E3 watcher for real-time FS→graph projection.</p>
      </div>
    </div>
  )
}

const meta: Meta<typeof AGT06FsProjectsToGraphStory> = {
  title: 'Features/AgentSemantics/AGT-06 fs projects to graph',
  component: AGT06FsProjectsToGraphStory,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AGT06FsProjectsToGraphStory>

export const Default: Story = {
  name: 'slice06 -- AGT-06 fs projects to graph',
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}