import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from '../src/shared/ThemeProvider'
import type { ReactNode } from 'react'

const withThemeProvider = (Story: () => ReactNode) => (
  <ThemeProvider>
    <Story />
  </ThemeProvider>
)

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0a0a0a' }],
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [withThemeProvider],
}

export default preview
