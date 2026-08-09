import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import NewProjectBtn from './NewProjectBtn'
import type { NewProjectBtnProps } from './projectPickerTypes'

const meta: Meta<typeof NewProjectBtn> = {
  title: 'Features/ProjectPicker/NewProjectBtn',
  component: NewProjectBtn,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof NewProjectBtn>

export const Default: Story = {
  args: {
    onClick: () => {},
  } as NewProjectBtnProps,
}
