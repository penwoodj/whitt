import type { Meta, StoryObj } from '@storybook/react'
import LineSvg from './LineSvg'
import { mkCoord } from './lineData'

const meta = {
  title: 'Features/Line/LineSvg',
  component: LineSvg,
  tags: ['autodocs'],
} satisfies Meta<typeof LineSvg>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
  },
}

export const Hovered: Story = {
  args: {
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    isHovered: true,
  },
}

export const Active: Story = {
  args: {
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    isActive: true,
  },
}

export const WithCustomColor: Story = {
  args: {
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    statusColor: '#0066ff',
  },
}
