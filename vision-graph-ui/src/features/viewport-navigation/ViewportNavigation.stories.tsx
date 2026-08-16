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

export const NAV02PanModes: Story = {
  name: 'NAV-02 pan modes',
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('[data-testid="react-flow__canvas"]')
    if (!canvas) throw new Error('Canvas not found')

    const mouseDownEvent = new MouseEvent('mousedown', {
      clientX: 100,
      clientY: 100,
      bubbles: true,
    })

    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 150,
      clientY: 150,
      bubbles: true,
    })

    const mouseUpEvent = new MouseEvent('mouseup', {
      bubbles: true,
    })

    canvas.dispatchEvent(mouseDownEvent)
    canvas.dispatchEvent(mouseMoveEvent)
    canvas.dispatchEvent(mouseUpEvent)

    await new Promise(resolve => setTimeout(resolve, 100))
  },
}

export const NAV04FitView: Story = {
  name: 'NAV-04 fit view',
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('[data-testid="react-flow__canvas"]')
    if (!canvas) throw new Error('Canvas not found')

    await new Promise(resolve => setTimeout(resolve, 100))
  },
}

export const NAV05Minimap: Story = {
  name: 'NAV-05 minimap',
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('[data-testid="react-flow__canvas"]')
    if (!canvas) throw new Error('Canvas not found')

    await new Promise(resolve => setTimeout(resolve, 100))
  },
}

export const NAV08SpawnReveal: Story = {
  name: 'NAV-08 spawn reveal',
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('[data-testid="react-flow__canvas"]')
    if (!canvas) throw new Error('Canvas not found')

    await new Promise(resolve => setTimeout(resolve, 100))
  },
}

export const NAV06CursorSemantics: Story = {
  name: 'NAV-06 cursor semantics',
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('[data-testid="react-flow__canvas"]')
    if (!canvas) throw new Error('Canvas not found')

    await new Promise(resolve => setTimeout(resolve, 100))
  },
}

export const NAV07KeyboardNudge: Story = {
  name: 'NAV-07 keyboard nudge',
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('[data-testid="react-flow__canvas"]')
    if (!canvas) throw new Error('Canvas not found')

    const arrowRightEvent = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
    })

    document.dispatchEvent(arrowRightEvent)

    await new Promise(resolve => setTimeout(resolve, 100))
  },
}
