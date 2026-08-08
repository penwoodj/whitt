import type { Meta, StoryObj } from '@storybook/react'
import { Settings, ConnectedSettings } from './Settings'

const meta = {
  title: 'Settings/Settings',
  component: Settings,
  tags: ['autodocs'],
} satisfies Meta<typeof Settings>

export default meta
type Story = StoryObj<typeof Settings>

export const Default: Story = {
  args: {
    state: {
      isAuto: true,
      scTxt: 'Ctrl+Space',
      eptTxt: 'http://localhost:8080',
      folderPath: '',
    },
    updateState: () => {},
  },
}

export const AllCustom: Story = {
  args: {
    state: {
      isAuto: false,
      scTxt: 'Cmd+Shift+V',
      eptTxt: 'https://api.example.com/v1',
      folderPath: '/home/jon/projects/whitt',
    },
    updateState: () => {},
  },
}

export const AllInvalid: Story = {
  args: {
    state: {
      isAuto: true,
      scTxt: 'x',
      eptTxt: 'ftp://bad',
      folderPath: '',
    },
    updateState: () => {},
  },
}

export const Connected: Story = {
  render: () => <ConnectedSettings />,
}
