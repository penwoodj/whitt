import type { Meta, StoryObj } from '@storybook/react'
import LineAnim from './LineAnim'
import { mkCoord } from './lineData'

const meta = {
  title: 'Features/Line/LineAnim',
  component: LineAnim,
  tags: ['autodocs'],
} satisfies Meta<typeof LineAnim>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: {
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    status: 'loading',
  },
}

export const Done: Story = {
  args: {
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    status: 'done',
  },
}

export const ErrorState: Story = {
  args: {
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    status: 'error',
  },
}

export const Idle: Story = {
  args: {
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    status: 'idle',
  },
}
