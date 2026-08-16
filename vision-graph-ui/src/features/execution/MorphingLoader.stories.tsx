import type { Meta, StoryObj } from '@storybook/react'
import { MorphingLoader } from './MorphingLoader'
import { ThemeProvider } from '../../shared/ThemeProvider'

const meta = {
  title: 'Features/Execution/MorphingLoader',
  component: MorphingLoader,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof MorphingLoader>

export default meta
type Story = StoryObj<typeof meta>

export const Exe14MorphingIconLoader: Story = {
  name: 'slice05 -- EXE-14 morphing icon loader',
  args: {
    status: 'running',
    stepTitle: 'Processing workflow',
  },
}