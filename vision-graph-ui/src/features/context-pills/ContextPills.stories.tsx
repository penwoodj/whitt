import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import NodePromptArea from '../node/NodePromptArea'

const meta = {
  title: 'Features/ContextPills',
  component: NodePromptArea,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof NodePromptArea>

export default meta
type Story = StoryObj<typeof meta>

export const PIL01PillsOnHighlight: Story = {
  name: 'slice08 -- PIL-01 pills on highlight',
  render: (args) => (
    <ThemeProvider>
      <div style={{ width: '500px' }}>
        <NodePromptArea {...args} />
      </div>
    </ThemeProvider>
  ),
  args: {
    value: 'Explain this implementation',
    onChange: () => {},
    isStream: false,
    isRec: false,
    isCycleRun: false,
    onToggleRec: () => {},
    onSend: () => {},
    contextPills: [
      {
        id: 'pill-1',
        lineRange: 'L12-18',
        startLine: 12,
        endLine: 18,
        textSnippet: 'function processData(input) {\n  // logic here\n}',
        filePath: '/test/file.md'
      },
      {
        id: 'pill-2',
        lineRange: 'L24-30',
        startLine: 24,
        endLine: 30,
        textSnippet: 'const result = output.map(x => x * 2)',
        filePath: '/test/file.md'
      }
    ],
    onRemovePill: () => {},
  },
}

export const NoPills: Story = {
  render: (args) => (
    <ThemeProvider>
      <div style={{ width: '500px' }}>
        <NodePromptArea {...args} />
      </div>
    </ThemeProvider>
  ),
  args: {
    ...PIL01PillsOnHighlight.args,
    contextPills: [],
  },
}

export const PIL02RemoveViaX: Story = {
  name: 'slice08 -- PIL-02 remove via X',
  ...PIL01PillsOnHighlight,
}

export const PIL03LineNumbers: Story = {
  name: 'slice08 -- PIL-03 line numbers',
  ...PIL01PillsOnHighlight,
}

export const PILC01OverflowStacking: Story = {
  name: 'slice08 -- PILC-01 overflow stacking',
  render: (args) => (
    <ThemeProvider>
      <div style={{ width: '500px' }}>
        <NodePromptArea {...args} />
      </div>
    </ThemeProvider>
  ),
  args: {
    value: 'Explain this implementation',
    onChange: () => {},
    isStream: false,
    isRec: false,
    isCycleRun: false,
    onToggleRec: () => {},
    onSend: () => {},
    contextPills: Array.from({ length: 8 }, (_, i) => ({
      id: `pill-${i + 1}`,
      lineRange: `L${i * 2 + 1}-${i * 2 + 3}`,
      startLine: i * 2 + 1,
      endLine: i * 2 + 3,
      textSnippet: `snippet ${i + 1}`,
      filePath: '/test/file.md'
    })),
    onRemovePill: () => {},
  },
}