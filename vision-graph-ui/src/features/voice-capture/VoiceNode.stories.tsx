import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within, waitFor } from 'storybook/test'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { useVoiceInput } from './useVoiceInput'
import { createFakeSttEngine } from './fake/FakeSttEngine'

const TestComponent = ({ engine }: { engine: any }) => {
  const voiceInput = useVoiceInput(engine)

  return (
    <div data-testid="voice-input-state">
      <div data-testid="is-rec">{String(voiceInput.isRec)}</div>
      <div data-testid="interim-txt">{voiceInput.interimTxt}</div>
      <div data-testid="final-txt">{voiceInput.finalTxt}</div>
      <div data-testid="permission-denied">{String(voiceInput.permissionDenied)}</div>
      <div data-testid="error-msg">{voiceInput.errorMsg}</div>
      <div data-testid="tooltip-visible">{String(voiceInput.tooltipVisible)}</div>
      <button
        type="button"
        data-testid="start-btn"
        onClick={() => voiceInput.startRec()}
      >
        Start
      </button>
      <button
        type="button"
        data-testid="stop-btn"
        onClick={() => voiceInput.stopRec()}
      >
        Stop
      </button>
    </div>
  )
}

const meta: Meta<typeof TestComponent> = {
  title: 'Features/Voice Capture/VoiceNode',
  component: TestComponent,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TestComponent>

export const VOXC01MicPermissionFlow: Story = {
  name: 'slice02 -- VOXC-01 mic permission flow',
  args: {
    engine: {
      start: fn().mockRejectedValue(new Error('Permission denied: Microphone access denied')),
      stop: fn().mockResolvedValue(undefined),
      on: fn(),
      getState: fn().mockReturnValue('error'),
      getCapabilities: fn().mockReturnValue({
        webgpu: false,
        fallback: 'wasm',
        mic: true,
        secureContext: true,
        opfsCache: false,
      }),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const startBtn = canvas.getByTestId('start-btn')

    await userEvent.click(startBtn)

    await waitFor(() => {
      expect(canvas.getByTestId('permission-denied')).toHaveTextContent('true')
      expect(canvas.getByTestId('error-msg')).toHaveTextContent(/Permission denied/)
    })
  },
}

export const VOX01ClickStartsRecording: Story = {
  name: 'slice02 -- VOX-01 click starts recording',
  args: {
    engine: createFakeSttEngine(['hello', 'world']),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const startBtn = canvas.getByTestId('start-btn')

    expect(canvas.getByTestId('is-rec')).toHaveTextContent('false')

    await userEvent.click(startBtn)

    await waitFor(() => {
      expect(canvas.getByTestId('is-rec')).toHaveTextContent('true')
    })
  },
}

export const VOXC02InterimStyling: Story = {
  name: 'slice02 -- VOXC-02 interim styling',
  args: {
    engine: createFakeSttEngine(['hello']),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const startBtn = canvas.getByTestId('start-btn')

    await userEvent.click(startBtn)

    await waitFor(() => {
      expect(canvas.getByTestId('interim-txt')).toHaveTextContent('hello')
    })

    await waitFor(() => {
      expect(canvas.getByTestId('final-txt')).toHaveTextContent('hello')
      expect(canvas.getByTestId('interim-txt')).toHaveTextContent('')
    }, { timeout: 3000 })
  },
}
