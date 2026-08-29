import type { Meta, StoryObj } from '@storybook/react'
import { GitSync } from './GitSync'

const meta = {
  title: 'Features/Git Time Travel/GIT-01 commit per save',
  component: GitSync,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof GitSync>

export default meta
type Story = StoryObj<typeof meta>

export const CommitPerSave: Story = {
  args: {
    syncState: 'idle',
    syncError: null,
    onSync: async () => {}
  }
}

export const Gitc03MetadataSchema: Story = {
  args: {
    syncState: 'idle',
    syncError: null,
    onSync: async () => {}
  }
}