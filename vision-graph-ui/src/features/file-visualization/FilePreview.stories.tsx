import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import FilePreview from './FilePreview'

const meta = {
  title: 'Features/FileVisualization/slice07 -- FIL-01 area present',
  component: FilePreview,
  decorators: [(Story) => <ThemeProvider><Story /></ThemeProvider>],
} satisfies Meta<typeof FilePreview>

export default meta
type Story = StoryObj<typeof FilePreview>

export const FIL01AreaPresent: Story = {
  name: 'slice07 -- FIL-01 area present',
  args: {
    content: '# Node Details\n\nThis is a placeholder for the markdown content that will be rendered in the detail panel.\n\n## Features\n- Live token streams\n- Hook timeline\n- Artifact preview\n- Template variable values\n\n## Status\nThe node is currently processing your request.',
  },
}

export const FIL02MarkdownPreview: Story = {
  name: 'slice07 -- FIL-02 markdown preview',
  args: {
    content: '# Heading 1\n\n## Heading 2\n\nSome content with **bold** and *italic* text.\n\n- List item 1\n- List item 2\n\n`inline code` and:\n\n```\nconst code = "block";\n```\n\n[Link text](https://example.com)\n\n> This is a blockquote',
  },
}