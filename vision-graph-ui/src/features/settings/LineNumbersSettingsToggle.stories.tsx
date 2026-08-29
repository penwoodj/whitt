import type { Meta, StoryObj } from '@storybook/react'
import { LineNumbersSettingsToggle } from './LineNumbersSettingsToggle'
import { ThemeProvider } from '../../shared/ThemeProvider'

const meta = {
  title: 'Settings/LineNumbersSettingsToggle',
  component: LineNumbersSettingsToggle,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof LineNumbersSettingsToggle>

export default meta
type Story = StoryObj<typeof LineNumbersSettingsToggle>

export const Default: Story = {
  args: {},
}

export const FILX02DefaultOn: Story = {
  name: 'slice07 -- FILX-02 settings toggle default on',
  args: {},
}

export const SeededOff: Story = {
  name: 'slice07 -- FILX-02 settings toggle seeded off',
  args: {},
  play: async ({ canvasElement, step }) => {
    const { within, expect } = await import('storybook/test')
    const canvas = within(canvasElement)

    await step('Seed localStorage with false', () => {
      localStorage.setItem('whitt-file-preview-line-numbers', 'false')
    })

    const toggle = canvas.getByTestId('line-numbers-toggle') as HTMLInputElement
    await expect(toggle.checked).toBe(false)
  },
}