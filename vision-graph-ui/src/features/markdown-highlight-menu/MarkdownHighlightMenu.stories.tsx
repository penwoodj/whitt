import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import MarkdownHighlightMenu from './MarkdownHighlightMenu'
import { buildDefaultProps, buildEmptySelectionProps } from './markdownHighlightData'

const meta: Meta<typeof MarkdownHighlightMenu> = {
  title: 'Features/MarkdownHighlightMenu/MarkdownHighlightMenu',
  component: MarkdownHighlightMenu,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ position: 'relative', height: '400px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MarkdownHighlightMenu>

export const Visible: Story = {
  args: buildDefaultProps(),
}

export const HiddenNoSelection: Story = {
  args: buildEmptySelectionProps(),
}

export const HiddenNullPosition: Story = {
  args: {
    selectedText: 'React Flow',
    position: null,
    onExpand: () => {},
    onRefine: () => {},
    onClose: () => {},
  },
}
