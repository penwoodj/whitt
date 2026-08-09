import type { Meta, StoryFn } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import GraphSim from './GraphSim'

const meta = {
  title: 'Pages/GraphSim',
  component: GraphSim,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof GraphSim>

export default meta

export const Default: StoryFn = () => (
  <ThemeProvider>
    <GraphSim />
  </ThemeProvider>
)
