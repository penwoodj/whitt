import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within, waitFor } from 'storybook/test'
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
  title: 'Features/Voice Capture/VoiceNode/Editing',
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

export const VOX07AppendAtCursor: Story = {
  name: 'slice02 -- VOX-07 append at cursor',
  args: {
    engine: createFakeSttEngine(['hello']),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const startBtn = canvas.getByTestId('start-btn')

    await userEvent.click(startBtn)

    await waitFor(() => {
      expect(canvas.getByTestId('final-txt')).toHaveTextContent('hello')
    })

    voiceInputRef.current.setCursorPos(3)
    voiceInputRef.current.insertAtCursor('X')

    await waitFor(() => {
      expect(canvas.getByTestId('final-txt')).toHaveTextContent('helXlo')
    })
  },
}

export const VOX08EditOverHighlight: Story = {
  name: 'slice02 -- VOX-08 edit over highlight',
  args: {
    engine: createFakeSttEngine(['hello', 'world']),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const startBtn = canvas.getByTestId('start-btn')

    await userEvent.click(startBtn)

    await waitFor(() => {
      expect(canvas.getByTestId('final-txt')).toHaveTextContent('hello world')
    })

    voiceInputRef.current.setCursorPos(6)
    voiceInputRef.current.insertAtCursor('beautiful')

    await waitFor(() => {
      expect(canvas.getByTestId('final-txt')).toHaveTextContent('hello beautiful world')
    })
  },
}

export const VOX09EnterSends: Story = {
  name: 'slice02 -- VOX-09 enter sends',
  args: {
    engine: createFakeSttEngine(['test']),
    onSend: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const startBtn = canvas.getByTestId('start-btn')
    const input = canvas.getByTestId('text-input')
    const sendSpy = args.onSend as ReturnType<typeof fn>

    await userEvent.click(startBtn)

    await waitFor(() => {
      expect(canvas.getByTestId('final-txt')).toHaveTextContent('test')
    })

    await userEvent.click(input)
    await userEvent.keyboard('{Enter}')

    await waitFor(() => {
      expect(sendSpy).toHaveBeenCalledWith('test')
    })
  },
}

export const VOX10ShiftEnterNewline: Story = {
  name: 'slice02 -- VOX-10 shift-enter newline',
  args: {
    engine: createFakeSttEngine(['test']),
    onSend: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const startBtn = canvas.getByTestId('start-btn')
    const input = canvas.getByTestId('text-input')
    const sendSpy = args.onSend as ReturnType<typeof fn>

    await userEvent.click(startBtn)

    await waitFor(() => {
      expect(canvas.getByTestId('final-txt')).toHaveTextContent('test')
    })

    await userEvent.click(input)
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}')

    expect(sendSpy).not.toHaveBeenCalled()
  },
}