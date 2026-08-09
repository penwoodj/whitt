import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import MenuButton from './MenuButton'
import type { MenuButtonProps } from './markdownHighlightTypes'

const meta: Meta<typeof MenuButton> = {
  title: 'Features/MarkdownHighlightMenu/MenuButton',
  component: MenuButton,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MenuButton>

export const Expand: Story = {
  args: {
    icon: '+',
    label: 'Expand',
    onClick: () => {},
  } as MenuButtonProps,
}

export const Refine: Story = {
  args: {
    icon: '✎',
    label: 'Refine',
    onClick: () => {},
  } as MenuButtonProps,
}
