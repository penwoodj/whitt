import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within, waitFor } from 'storybook/test'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { useVoiceInput } from './useVoiceInput'
import { createFakeSttEngine } from './fake/FakeSttEngine'

const voiceInputRef: any = {}

const TestComponent = ({ engine, onSend }: { engine: any; onSend?: (text: string) => void }) => {
  const voiceInput = useVoiceInput(engine)

  if (onSend) {
    voiceInput.setSendCallback(onSend)
  }

  voiceInputRef.current = voiceInput

  return (
    <div data-testid="voice-input-state">
      <div data-testid="is-rec">{String(voiceInput.isRec)}</div>
      <div data-testid="interim-txt">{voiceInput.interimTxt}</div>
      <div data-testid="final-txt">{voiceInput.finalTxt}</div>
      <div data-testid="permission-denied">{String(voiceInput.permissionDenied)}</div>
      <div data-testid="error-msg">{voiceInput.errorMsg}</div>
      <div data-testid="tooltip-visible">{String(voiceInput.tooltipVisible)}</div>
      <div data-testid="tooltip-pinned">{String(voiceInput.tooltipPinned)}</div>
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
      <button
        type="button"
        data-testid="send-btn"
        onClick={() => voiceInput.send()}
      >
        Send
      </button>
      <button
        type="button"
        data-testid="set-tooltip-btn"
        onClick={() => voiceInput.setTooltipVisible(true)}
      >
        Show Tooltip
      </button>
      <button
        type="button"
        data-testid="pin-btn"
        onClick={() => voiceInput.toggleTooltipPin()}
      >
        Pin
      </button>
      <button
        type="button"
        data-testid="insert-cursor-btn"
        onClick={() => voiceInput.insertAtCursor('X', 3)}
      >
        Insert at Cursor
      </button>
      <button
        type="button"
        data-testid="set-cursor-btn"
        onClick={() => voiceInput.setCursorPos(6)}
      >
        Set Cursor
      </button>
      <input
        type="text"
        data-testid="text-input"
        defaultValue={voiceInput.finalTxt}
        onKeyDown={voiceInput.handleKeyDown}
      />
    </div>
  )
}

const meta: Meta<typeof TestComponent> = {
  title: 'Features/Voice Capture/VoiceNode/Tooltip',
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

export const VOX04HoverTooltipLiveText: Story = {
  name: 'slice02 -- VOX-04 hover tooltip live text',
  args: {
    engine: createFakeSttEngine(['hello', 'world']),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const startBtn = canvas.getByTestId('start-btn')

    await userEvent.click(startBtn)
    voiceInputRef.current.setTooltipVisible(true)

    await waitFor(() => {
      expect(canvas.getByTestId('tooltip-visible')).toHaveTextContent('true')
      expect(canvas.getByTestId('interim-txt')).toHaveTextContent('hello')
    })
  },
}

export const VOX05TooltipSideAdaptive: Story = {
  name: 'slice02 -- VOX-05 tooltip side adaptive',
  args: {
    engine: createFakeSttEngine(['test']),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const startBtn = canvas.getByTestId('start-btn')

    await userEvent.click(startBtn)

    await waitFor(() => {
      expect(canvas.getByTestId('is-rec')).toHaveTextContent('true')
    })
  },
}

export const VOX16DebouncedPromptFile: Story = {
  name: 'slice02 -- VOX-16 debounced prompt file',
  args: {
    engine: createFakeSttEngine(['test']),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const startBtn = canvas.getByTestId('start-btn')

    await userEvent.click(startBtn)

    await waitFor(() => {
      expect(canvas.getByTestId('final-txt')).toHaveTextContent('test')
    })

    await new Promise(resolve => setTimeout(resolve, 2100))
  },
}