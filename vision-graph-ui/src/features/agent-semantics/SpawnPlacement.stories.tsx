import type { Meta, StoryObj } from '@storybook/react'
import { useSpawnPlacement } from './useSpawnPlacement'
import { ThemeProvider } from '../../shared/ThemeProvider'

function AGTC02SpawnPlacementStory() {
  const { calculatePosition, getAnimationClass, getAnimationDuration, createLink } = useSpawnPlacement()

  const parentNode = { id: 'n1', position: { x: 100, y: 100 } }
  const existingSiblings = [
    { id: 'n2', position: { x: 250, y: 100 } },
    { id: 'n3', position: { x: 175, y: 216 } },
  ]

  const newPosition = calculatePosition(parentNode.position, existingSiblings)
  const animationClass = getAnimationClass()
  const animationDuration = getAnimationDuration()
  const link = createLink('n1', 'n4')

  return (
    <div style={{ padding: '16px', color: '#fff' }}>
      <h2>AGTC-02: Spawn Placement</h2>
      <div>
        <h3>Parent Node</h3>
        <pre>{JSON.stringify(parentNode, null, 2)}</pre>
        <h3>Existing Siblings</h3>
        <pre>{JSON.stringify(existingSiblings, null, 2)}</pre>
        <h3>New Spawn Position</h3>
        <pre>{JSON.stringify(newPosition, null, 2)}</pre>
        <h3>Animation</h3>
        <p>Class: {animationClass}</p>
        <p>Duration: {animationDuration}</p>
        <h3>Parent Link</h3>
        <pre>{JSON.stringify(link, null, 2)}</pre>
      </div>
    </div>
  )
}

const meta: Meta<typeof AGTC02SpawnPlacementStory> = {
  title: 'Features/AgentSemantics/AGTC-02 spawn placement',
  component: AGTC02SpawnPlacementStory,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AGTC02SpawnPlacementStory>

export const Default: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}