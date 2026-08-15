import type { Meta, StoryObj } from '@storybook/react'
import { ReactFlow, Background, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Node, emptyNode } from '../node'

type GraphPageProps = {
  title: string
}

const GraphPage = ({ title }: GraphPageProps) => {
  const initialNode = emptyNode()
  const nodeWithTitle = { ...initialNode, title }

  const nodes = [
    {
      id: nodeWithTitle.id,
      type: 'whittNode',
      position: { x: 100, y: 100 },
      data: nodeWithTitle,
    },
  ]

  const nodeTypes = { whittNode: Node }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow nodes={nodes} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

const meta: Meta<GraphPageProps> = {
  title: 'Pages/GraphPage',
  component: GraphPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', defaultValue: 'Start Node' },
  },
}

export default meta

type Story = StoryObj<GraphPageProps>

export const Default: Story = {
  args: { title: 'Start Node' },
}

export const EmptyTitle: Story = {
  args: { title: 'New Node' },
}

export const LongTitle: Story = {
  args: { title: 'This is a long title for testing how the node handles overflow scenarios' },
}
