import type { Meta, StoryObj } from '@storybook/react'
import { GitSync } from './GitSync'

const meta = {
  title: 'Features/GitSync/GitSync',
  component: GitSync,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof GitSync>

export default meta
type Story = StoryObj<typeof meta>

const idleArgs = {
  syncState: 'idle' as const,
  syncError: null,
  onSync: async () => {}
}

export const Git01CommitPerSave: Story = {
  name: 'slice09 -- GIT-01 commit per save',
  args: idleArgs
}

export const Git02AgentCommits: Story = {
  name: 'slice09 -- GIT-02 agent commits',
  args: idleArgs
}

export const Git03AllMutationsLogged: Story = {
  name: 'slice09 -- GIT-03 all mutations logged',
  args: idleArgs
}

export const Git04SyncButton: Story = {
  name: 'slice09 -- GIT-04 sync button',
  args: idleArgs
}

export const Gitc01SyncProgress: Story = {
  name: 'slice09 -- GITC-01 sync progress',
  args: {
    syncState: 'syncing' as const,
    syncError: null,
    onSync: async () => {}
  }
}

export const Gitc02SyncFailure: Story = {
  name: 'slice09 -- GITC-02 sync failure',
  args: {
    syncState: 'error' as const,
    syncError: 'Push rejected: remote has diverged — resolve in external git client',
    onSync: async () => {}
  }
}

export const Gitc03MetadataSchema: Story = {
  name: 'slice09 -- GITC-03 metadata schema',
  args: idleArgs
}

export const Gitc04CadenceGuard: Story = {
  name: 'slice09 -- GITC-04 cadence guard',
  args: idleArgs
}
