import { describe, expect, it } from 'vitest'
import {
  initialSpeechState,
  reduceSpeech,
  type SpeechEvent,
} from './speechTypes'

describe('Local STT speech state', () => {
  it('blocks unsupported capture', () => {
    const state = reduceSpeech(initialSpeechState, { type: 'unsupported', message: 'No local STT' })
    expect(state).toMatchObject({ state: 'error', error: 'No local STT' })
  })

  it('tracks permission pending then denied', () => {
    const pending = reduceSpeech(initialSpeechState, { type: 'permission-requested' })
    const denied = reduceSpeech(pending, { type: 'permission-denied', message: 'Permission denied' })
    expect(pending.state).toBe('permission-pending')
    expect(denied.state).toBe('denied')
  })

  it('preserves committed text on error', () => {
    const listening = reduceSpeech(
      { ...initialSpeechState, state: 'listening', text: 'keep this' },
      { type: 'error', message: 'Decoder failed' },
    )
    expect(listening).toMatchObject({ state: 'error', text: 'keep this', error: 'Decoder failed' })
  })

  it('orders final segments by timestamp', () => {
    const events: SpeechEvent[] = [
      { type: 'segment', segment: { text: 'world', start: 1, end: 2 } },
      { type: 'segment', segment: { text: 'hello', start: 0, end: 1 } },
    ]
    const state = events.reduce(reduceSpeech, { ...initialSpeechState, state: 'processing' })
    expect(state.text).toBe('hello world')
  })

  it('processes stop before final result', () => {
    const processing = reduceSpeech({ ...initialSpeechState, state: 'listening' }, { type: 'stop-requested' })
    const stopped = reduceSpeech(processing, { type: 'segment', segment: { text: 'done', start: 0, end: 1 } })
    expect(processing.state).toBe('processing')
    expect(stopped).toMatchObject({ state: 'stopped', text: 'done' })
  })

  it('maps amplitude and reduced motion', () => {
    expect(reduceSpeech(initialSpeechState, { type: 'amplitude', level: 0 }).amplitude).toBe(0)
    expect(reduceSpeech(initialSpeechState, { type: 'amplitude', level: 0.5 }).amplitude).toBe(0.5)
    expect(reduceSpeech(initialSpeechState, { type: 'amplitude', level: 2 }).amplitude).toBe(1)
    expect(reduceSpeech(initialSpeechState, { type: 'motion', reduced: true }).isStatic).toBe(true)
  })
})
