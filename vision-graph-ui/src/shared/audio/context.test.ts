import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as contextModule from './context'

class MockAudioContext {
  sampleRate = 16000
  state: 'suspended' | 'running' = 'suspended'
  close = vi.fn().mockResolvedValue(undefined)
  resume = vi.fn().mockImplementation(async () => {
    this.state = 'running'
  })
  createMediaStreamSource = vi.fn()
  createAnalyser = vi.fn()
}

describe('AudioContext singleton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.AudioContext = MockAudioContext as any
  })

  afterEach(() => {
    contextModule.destroyAudioContext()
    vi.restoreAllMocks()
  })

  it('AudioContext singleton init @16kHz', () => {
    const ctx1 = contextModule.getAudioContext()
    const ctx2 = contextModule.getAudioContext()

    expect(ctx1).toBe(ctx2)
    expect(ctx1.sampleRate).toBe(16000)
  })

  it('AudioContext resumable via user gesture', async () => {
    const ctx = contextModule.getAudioContext()
    ;(ctx as any).state = 'suspended'

    await contextModule.resumeAudioContext()

    expect((ctx as any).resume).toHaveBeenCalled()
  })

  it('AudioContext StrictMode double-mount safe', () => {
    const ctx1 = contextModule.getAudioContext()
    contextModule.destroyAudioContext()
    expect((ctx1 as any).close).toHaveBeenCalled()

    expect(() => contextModule.destroyAudioContext()).not.toThrow()

    const ctx2 = contextModule.getAudioContext()
    expect(ctx2).not.toBe(ctx1)
  })
})
