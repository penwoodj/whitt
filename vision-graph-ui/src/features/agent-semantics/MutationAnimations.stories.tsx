import type { Meta, StoryObj } from '@storybook/react'
import { useGraphMutationHandler } from './useGraphMutationHandler'
import { mutationAnimationMap, ANIMATION_DURATIONS } from './mutationAnimations'
import { ThemeProvider } from '../../shared/ThemeProvider'
import type { GraphMutation } from '../../shared/agent/types'

function AGTC01EventVocabularyStory() {
  const { handleMutation } = useGraphMutationHandler()

  const mutations: GraphMutation[] = [
    { op: 'spawn', parentNodeId: 'n1', newNodeId: 'n2', title: 'Child' },
    { op: 'edit', nodeId: 'n1' },
    { op: 'move', nodeId: 'n2', from: 'pos1', to: 'pos2' },
    { op: 'group', nodeIds: ['n1', 'n2'], groupId: 'g1' },
    { op: 'detach', nodeId: 'n2' },
    { op: 'link', source: 'n1', target: 'n2' },
    { op: 'unlink', source: 'n1', target: 'n2' },
  ]

  const effects = mutations.map(handleMutation)

  return (
    <div style={{ padding: '16px', color: '#fff' }}>
      <h2>AGTC-01: Event Vocabulary</h2>
      <div>
        <h3>Mutation Animation Mapping</h3>
        <pre>{JSON.stringify(mutationAnimationMap, null, 2)}</pre>
        <h3>Animation Durations</h3>
        <pre>{JSON.stringify(ANIMATION_DURATIONS, null, 2)}</pre>
        <h3>Effect Examples</h3>
        {effects.map((effect, i) => (
          <div key={`${mutations[i].op}-${i}`} style={{ marginBottom: '8px' }}>
            <strong>{mutations[i].op}:</strong> {effect.animationClass} ({effect.duration})
          </div>
        ))}
      </div>
    </div>
  )
}

function AGT04MutationsAsMovementStory() {
  const { handleMutation } = useGraphMutationHandler()

  const mutations: GraphMutation[] = [
    { op: 'spawn', parentNodeId: 'n1', newNodeId: 'n2', title: 'Child' },
    { op: 'move', nodeId: 'n2', from: '{x:100,y:100}', to: '{x:200,y:200}' },
  ]

  const effects = mutations.map(handleMutation)

  return (
    <div style={{ padding: '16px', color: '#fff' }}>
      <h2>AGT-04: Mutations as Movement</h2>
      <div>
        <h3>Spawn + Move Sequence</h3>
        <pre>{JSON.stringify(mutations, null, 2)}</pre>
        <h3>Resulting Effects</h3>
        <pre>{JSON.stringify(effects, null, 2)}</pre>
        <h3>No Teleport</h3>
        <p>fade-in-settle (400ms) → shift (300ms) = smooth transition</p>
      </div>
    </div>
  )
}

const meta: Meta<typeof AGTC01EventVocabularyStory> = {
  title: 'Features/AgentSemantics/AGTC-01 event vocabulary',
  component: AGTC01EventVocabularyStory,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AGTC01EventVocabularyStory>

export const Default: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export const AGT04MutationsAsMovement: Story = {
  render: () => (
    <ThemeProvider>
      <AGT04MutationsAsMovementStory />
    </ThemeProvider>
  ),
}