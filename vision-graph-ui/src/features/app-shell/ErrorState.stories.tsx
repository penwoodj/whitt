import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import ErrorState from './ErrorState'
import type { ErrorStateProps } from './ErrorState'

const meta: Meta<typeof ErrorState> = {
  title: 'Features/AppShell/ErrorState',
  component: ErrorState,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ErrorState>

export const APPC03LoadFailure: Story = {
  name: 'slice01 -- APPC-03 load failure',
  args: {
    message: 'Failed to load project: File not found or corrupted',
    onRetry: () => {},
  } as ErrorStateProps,
}