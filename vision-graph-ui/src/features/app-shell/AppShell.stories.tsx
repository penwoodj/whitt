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

export const APP01OpensNewProject: Story = {
  name: 'slice01 -- APP-01 opens new project',
  args: {
    children: <div data-testid="canvas">Single white bubble rendered</div>,
  } as AppShellProps,
}

export const APP02RailFixed: Story = {
  name: 'slice01 -- APP-02 rail fixed',
  args: {
    sidebar: <div data-testid="project-rail" style={{ width: '60px', background: '#1f1f1f' }}>Project Rail</div>,
    children: <div data-testid="canvas" style={{ transform: 'translateX(500px)' }}>Canvas panned right</div>,
  } as AppShellProps,
}

export const APP06SelectLoadsGraph: Story = {
  name: 'slice01 -- APP-06 select loads graph',
  args: {
    sidebar: <div data-testid="project-rail" style={{ width: '60px', background: '#1f1f1f' }}>Project Rail</div>,
    children: <div data-testid="canvas">Project B graph loaded</div>,
  } as AppShellProps,
}

export const APP07FreshSession: Story = {
  name: 'slice01 -- APP-07 fresh session',
  args: {
    sidebar: <div data-testid="project-rail" style={{ width: '60px', background: '#1f1f1f' }}>Project Rail</div>,
    children: <div data-testid="canvas">Single bubble for new project</div>,
  } as AppShellProps,
}
