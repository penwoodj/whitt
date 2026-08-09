import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import GraphTitle from './GraphTitle'
import type { GraphTitleProps } from './topBarTypes'

const meta: Meta<typeof GraphTitle> = {
  title: 'Features/TopBar/GraphTitle',
  component: GraphTitle,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof GraphTitle>

export const Default: Story = {
  args: {
    title: 'New Research',
  } as GraphTitleProps,
}

export const LongTitle: Story = {
  args: {
    title: 'A'.repeat(100),
  } as GraphTitleProps,
}
