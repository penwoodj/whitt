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
  title: 'Features/Voice Capture/VoiceNode/Sending',
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

export const VOX14DblclickSends: Story = {
  name: 'slice02 -- VOX-14 dblclick sends',
  args: {
    engine: createFakeSttEngine(['test']),
    onSend: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const startBtn = canvas.getByTestId('start-btn')
    const sendSpy = args.onSend as ReturnType<typeof fn>

    await userEvent.click(startBtn)

    await waitFor(() => {
      expect(canvas.getByTestId('final-txt')).toHaveTextContent('test')
    })

    await userEvent.dblClick(startBtn)

    await waitFor(() => {
      expect(sendSpy).toHaveBeenCalledWith('test')
    })
  },
}

export const VOX15DblRightClickSends: Story = {
  name: 'slice02 -- VOX-15 dbl-right-click sends',
  args: {
    engine: createFakeSttEngine(['test']),
    onSend: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const startBtn = canvas.getByTestId('start-btn')
    const sendSpy = args.onSend as ReturnType<typeof fn>

    await userEvent.click(startBtn)

    await waitFor(() => {
      expect(canvas.getByTestId('final-txt')).toHaveTextContent('test')
    })

    await userEvent.pointer([
      { keys: '[MouseRight]', target: startBtn },
      { keys: '[/MouseRight]', target: startBtn },
    ])

    await userEvent.pointer([
      { keys: '[MouseRight]', target: startBtn },
      { keys: '[/MouseRight]', target: startBtn },
    ])

    await waitFor(() => {
      expect(sendSpy).toHaveBeenCalledWith('test')
    })
  },
}

export const VOXC05EmptySendNoop: Story = {
  name: 'slice02 -- VOXC-05 empty send noop',
  args: {
    engine: createFakeSttEngine([]),
    onSend: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const startBtn = canvas.getByTestId('start-btn')
    const sendBtn = canvas.getByTestId('send-btn')
    const sendSpy = args.onSend as ReturnType<typeof fn>

    await userEvent.click(startBtn)
    await userEvent.click(sendBtn)

    expect(sendSpy).not.toHaveBeenCalled()
  },
}