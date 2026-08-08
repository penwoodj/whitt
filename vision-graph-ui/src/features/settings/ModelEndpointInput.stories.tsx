import type { Meta, StoryObj } from '@storybook/react'
import { ModelEndpointInput } from './ModelEndpointInput'

const meta = {
  title: 'Settings/ModelEndpointInput',
  component: ModelEndpointInput,
  tags: ['autodocs'],
} satisfies Meta<typeof ModelEndpointInput>

export default meta
type Story = StoryObj<typeof ModelEndpointInput>

export const Default: Story = {
  args: {
    eptTxt: 'http://localhost:8080',
    onChange: () => {},
  },
}

export const Invalid: Story = {
  args: {
    eptTxt: 'ftp://bad',
    onChange: () => {},
  },
}

export const Custom: Story = {
  args: {
    eptTxt: 'https://api.example.com/v1',
    onChange: () => {},
  },
}
