import type { Meta, StoryObj } from '@storybook/react'
import { ReactFlowProvider } from '@xyflow/react'
import GraphSim from '../graph-sim/GraphSim'

const meta = {
  title: 'Features/ViewportNav/Zoom Config',
  component: GraphSim,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <Story />
      </ReactFlowProvider>
    ),
  ],
} satisfies Meta<typeof GraphSim>

export default meta
type Story = StoryObj<typeof meta>

export const NAV01ZoomToCursor: Story = {
  name: 'NAV-01 zoom to cursor',
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('[data-testid="react-flow__canvas"]')
    if (!canvas) throw new Error('Canvas not found')

    const wheelEvent = new WheelEvent('wheel', {
      clientX: 200,
      clientY: 200,
      deltaY: -100,
      bubbles: true,
    })

    canvas.dispatchEvent(wheelEvent)

    await new Promise(resolve => setTimeout(resolve, 100))
  },
}

export const NAV03ZoomLimits: Story = {
  name: 'NAV-03 zoom limits',
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('[data-testid="react-flow__canvas"]')
    if (!canvas) throw new Error('Canvas not found')

    const wheelEvent = new WheelEvent('wheel', {
      clientX: 200,
      clientY: 200,
      deltaY: -1000,
      bubbles: true,
    })

    canvas.dispatchEvent(wheelEvent)

    await new Promise(resolve => setTimeout(resolve, 100))

    const zoomOutEvent = new WheelEvent('wheel', {
      clientX: 200,
      clientY: 200,
      deltaY: 1000,
      bubbles: true,
    })

    canvas.dispatchEvent(zoomOutEvent)

    await new Promise(resolve => setTimeout(resolve, 100))
  },
}
