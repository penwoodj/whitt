import type { Meta, StoryObj } from '@storybook/react'
import { YamlWorkflowVisualizer } from './YamlWorkflowVisualizer'
import { ThemeProvider } from '../../shared/ThemeProvider'

const meta = {
  title: 'slice05 -- EXE-06 yaml visualizer',
  component: YamlWorkflowVisualizer,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof YamlWorkflowVisualizer>

export default meta
type Story = StoryObj<typeof meta>

export const Exe06YamlVisualizer: Story = {
  name: 'EXE-06 yaml visualizer',
  args: {
    workflow: `steps:
  - name: step1
    action: test
  - name: step2
    action: process`,
  },
}

export const Exe07ColoredExpandable: Story = {
  name: 'EXE-07 colored expandable',
  args: {
    workflow: `section1: value1
section2: value2
section3: value3`,
  },
}

export const Exe08DensePadding: Story = {
  name: 'EXE-08 dense padding',
  args: {
    workflow: `level1:
  level2:
    level3:
      level4`,
  },
}

export const Exec01ConfirmShowsYaml: Story = {
  name: 'EXEC-01 confirm shows yaml',
  args: {
    workflow: `name: confirm-test
steps:
  - name: confirm-step`,
  },
}

export const Exec03YamlFailure: Story = {
  name: 'EXEC-03 yaml failure',
  args: {
    workflow: `invalid: yaml: content: [unclosed`,
    disabledOnError: true,
  },
}