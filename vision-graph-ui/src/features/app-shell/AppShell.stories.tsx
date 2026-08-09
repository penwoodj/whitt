import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import AppShell from './AppShell'
import type { AppShellProps } from './appShellTypes'

const meta: Meta<typeof AppShell> = {
  title: 'Features/AppShell/AppShell',
  component: AppShell,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof AppShell>

export const FullLayout: Story = {
  args: {
    sidebar: <div style={{ padding: '16px', background: '#1f1f1f' }}>Sidebar</div>,
    topbar: <div style={{ padding: '16px', background: '#141414' }}>TopBar</div>,
    children: <div style={{ padding: '16px' }}>Main Content</div>,
  } as AppShellProps,
}

export const NoSidebar: Story = {
  args: {
    topbar: <div style={{ padding: '16px', background: '#141414' }}>TopBar</div>,
    children: <div style={{ padding: '16px' }}>Main Content</div>,
  } as AppShellProps,
}

export const NoTopbar: Story = {
  args: {
    sidebar: <div style={{ padding: '16px', background: '#1f1f1f' }}>Sidebar</div>,
    children: <div style={{ padding: '16px' }}>Main Content</div>,
  } as AppShellProps,
}

export const ChildrenOnly: Story = {
  args: {
    children: <div style={{ padding: '16px' }}>Main Content</div>,
  } as AppShellProps,
}
