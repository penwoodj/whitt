import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import SyncBtn from './SyncBtn'
import type { SyncBtnProps } from './topBarTypes'

const meta: Meta<typeof SyncBtn> = {
  title: 'Features/TopBar/SyncBtn',
  component: SyncBtn,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SyncBtn>

export const Idle: Story = {
  args: {
    syncStatus: 'idle',
    lastSyncLabel: 'Synced 2s ago',
    onClick: () => {},
  } as SyncBtnProps,
}

export const Syncing: Story = {
  args: {
    syncStatus: 'syncing',
    lastSyncLabel: 'Syncing...',
    onClick: () => {},
  } as SyncBtnProps,
}

export const Synced: Story = {
  args: {
    syncStatus: 'synced',
    lastSyncLabel: 'Synced just now',
    onClick: () => {},
  } as SyncBtnProps,
}

export const SyncError: Story = {
  args: {
    syncStatus: 'error',
    lastSyncLabel: 'Sync failed',
    onClick: () => {},
  } as SyncBtnProps,
}
