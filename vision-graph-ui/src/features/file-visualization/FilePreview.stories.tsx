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

export const FIL04EditToggle: Story = {
  name: 'slice07 -- FIL-04 edit toggle',
  args: {
    content: '# Editable Content\n\nClick Edit to see raw mode',
  },
}

export const FIL05BlurSaves: Story = {
  name: 'slice07 -- FIL-05 blur saves',
  args: {
    content: '# Content to Edit\n\nModify this, then click Save',
  },
}

export const FILC01Skeleton: Story = {
  name: 'slice07 -- FILC-01 skeleton',
  args: {
    content: '# Loading Content\n\nWait for it',
    isLoading: true,
  },
}

export const FILC02SaveFailure: Story = {
  name: 'slice07 -- FILC-02 save failure',
  args: {
    content: '# Content to Edit\n\nThis will fail on save',
  },
  parameters: {
    docs: {
      description: 'Simulates save failure by not providing writeQueue',
    },
  },
}

export const FILC03ConcurrentGuard: Story = {
  name: 'slice07 -- FILC-03 concurrent guard',
  args: {
    content: '# Content\n\nThis will show conflict notice',
  },
  parameters: {
    docs: {
      description: 'Shows conflict notice when external change detected',
    },
  },
}

export const FILC04CloseGuard: Story = {
  name: 'slice07 -- FILC-04 close guard',
  args: {
    content: '# Content That Fails to Save\n\nEditor stays open on error',
  },
  parameters: {
    docs: {
      description: 'Blocks editor exit on save failure - keeps cm-editor visible with error-notice',
    },
  },
}

export const FIL07CtrlF: Story = {
  name: 'slice07 -- FIL-07 ctrl+F',
  args: {
    content: '# Search Test\n\nThis is a test with multiple test words. Use the find input to search for "test".',
  },
  parameters: {
    docs: {
      description: 'Ctrl+F local search - shows find input, highlights matches in preview',
    },
  },
}

export const FILX01LineNumbers: Story = {
  name: 'slice07 -- FILX-01 line numbers both modes',
  args: {
    content: '# Line Numbers Test\n\nLine 1\n\nLine 2\n\nLine 3',
  },
  parameters: {
    docs: {
      description: 'Line numbers shown in both preview and raw mode, persisted via localStorage',
    },
  },
}