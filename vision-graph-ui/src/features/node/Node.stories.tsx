import type { Meta, StoryObj } from '@storybook/react'
import Node from './Node'
import { emptyNode, busyNode, recordingNode, doneNode } from './nodeData'

const meta = {
  title: 'Features/Node/Node',
  component: Node,
  tags: ['autodocs'],
} satisfies Meta<typeof Node>

export default meta
type Story = StoryObj<typeof Node>

export const Default: Story = {
  args: {
    data: emptyNode('1'),
    onSend: (txt) => console.log('Send:', txt),
    onTitleChange: (title) => console.log('Title changed:', title),
  },
}

export const Recording: Story = {
  args: {
    data: recordingNode('1'),
    onSend: (txt) => console.log('Send:', txt),
    onTitleChange: (title) => console.log('Title changed:', title),
  },
}

export const Running: Story = {
  args: {
    data: busyNode('1'),
    onSend: (txt) => console.log('Send:', txt),
    onTitleChange: (title) => console.log('Title changed:', title),
  },
}

export const Done: Story = {
  args: {
    data: doneNode('1'),
    onSend: (txt) => console.log('Send:', txt),
    onTitleChange: (title) => console.log('Title changed:', title),
  },
}

export const WithExpandedTodos: Story = {
  args: {
    data: { ...busyNode('1'), todosExpanded: true },
    onSend: (txt) => console.log('Send:', txt),
    onTitleChange: (title) => console.log('Title changed:', title),
  },
}

export const WithDetailExpanded: Story = {
  args: {
    data: { ...emptyNode('1'), detailExpanded: true },
    onSend: (txt) => console.log('Send:', txt),
    onTitleChange: (title) => console.log('Title changed:', title),
  },
}
