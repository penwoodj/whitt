import type { Meta, StoryObj } from '@storybook/react'
import LineLabel from './LineLabel'
import { mkCoord } from './lineData'

const meta = {
  title: 'Features/Line/LineLabel',
  component: LineLabel,
  tags: ['autodocs'],
} satisfies Meta<typeof LineLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    lineKind: 'PRODUCED',
  },
}

export const LongKind: Story = {
  args: {
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    lineKind: 'ENQUEUED_BY',
  },
}

export const Clickable: Story = {
  args: {
    srcCoord: mkCoord(0, 0),
    dstCoord: mkCoord(100, 100),
    lineKind: 'DEPENDS_ON',
    onLabelClick: () => {},
  },
}

export const AllKinds: Story = {
  args: {
    srcCoord: mkCoord(50, 50),
    dstCoord: mkCoord(150, 50),
    lineKind: 'ENQUEUED_BY',
  },
}
