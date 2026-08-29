import type { Meta, StoryObj } from '@storybook/react'
import { useAgentContext } from './useAgentContext'
import { useGraphMutationHandler } from './useGraphMutationHandler'
import { getAnimationClass } from './mutationAnimations'
import { ThemeProvider } from '../../shared/ThemeProvider'
import type { GraphMutation } from '../../shared/agent/types'

function AGT01DefaultContextStory() {
  const { buildPayload, canWriteTo } = useAgentContext({
    focusedNodeId: 'n1',
  })

  const payload = buildPayload('make this clearer')

  return (
    <div style={{ padding: '16px', color: '#fff' }}>
      <h2>AGT-01: Default Context</h2>
      <div>
        <h3>Focused Node: n1</h3>
        <h3>Prompt: "make this clearer"</h3>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
        <h3>Can write to n1: {canWriteTo('n1').toString()}</h3>
        <h3>Can write to n2: {canWriteTo('n2').toString()}</h3>
      </div>
    </div>
  )
}

function AGT02LinkedEditStory() {
  const { buildPayload, canWriteTo } = useAgentContext({
    focusedNodeId: 'n1',
    linkedNodeIds: ['n2'],
  })

  const payload = buildPayload('update the child node')

  return (
    <div style={{ padding: '16px', color: '#fff' }}>
      <h2>AGT-02: Linked Edit Allowed</h2>
      <div>
        <h3>Focused Node: n1</h3>
        <h3>Linked Nodes: n2</h3>
        <h3>Prompt: "update the child node"</h3>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
        <h3>Can write to n1: {canWriteTo('n1').toString()}</h3>
        <h3>Can write to n2: {canWriteTo('n2').toString()}</h3>
        <h3>Can write to n3: {canWriteTo('n3').toString()}</h3>
      </div>
    </div>
  )
}

function AGT03InitialOneFileStory() {
  const { buildPayload } = useAgentContext({
    focusedNodeId: 'root',
  })

  const payload = buildPayload('start project')

  return (
    <div style={{ padding: '16px', color: '#fff' }}>
      <h2>AGT-03: Initial One File</h2>
      <div>
        <h3>Focused Node: root</h3>
        <h3>Prompt: "start project"</h3>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
        <h3>Context node count: 1</h3>
        <h3>Linked nodes count: 0</h3>
      </div>
    </div>
  )
}

const meta: Meta<typeof AGT01DefaultContextStory> = {
  title: 'Features/AgentSemantics/AGT-01 default context',
  component: AGT01DefaultContextStory,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AGT01DefaultContextStory>

export const Default: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export const AGT02LinkedEdit: Story = {
  render: () => (
    <ThemeProvider>
      <AGT02LinkedEditStory />
    </ThemeProvider>
  ),
}

export const AGT03InitialOneFile: Story = {
  render: () => (
    <ThemeProvider>
      <AGT03InitialOneFileStory />
    </ThemeProvider>
  ),
}