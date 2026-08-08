import type { Meta, StoryObj } from '@storybook/react'
import Line from './Line'
import { mkCoord } from './lineData'

const meta = {
  title: 'Features/Line/Line',
  component: Line,
  tags: ['autodocs'],
} satisfies Meta<typeof Line>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: 'default',
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
  },
}

export const Active: Story = {
  args: {
    id: 'active',
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    isActive: true,
  },
}

export const Loading: Story = {
  args: {
    id: 'loading',
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    status: 'loading',
  },
}

export const ErrorState: Story = {
  args: {
    id: 'error',
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    status: 'error',
  },
}

export const WithLabel: Story = {
  args: {
    id: 'with-label',
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    lineKind: 'PRODUCED',
    onLabelClick: () => {},
  },
}

export const Complete: Story = {
  args: {
    id: 'complete',
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(200, 150),
    lineKind: 'DEPENDS_ON',
    status: 'loading',
    isActive: true,
    onLabelClick: () => {},
  },
}

export const AllStates: Story = {
  args: {
    id: 'all-states',
    srcCoord: mkCoord(50, 50),
    dstCoord: mkCoord(150, 50),
  },
}
