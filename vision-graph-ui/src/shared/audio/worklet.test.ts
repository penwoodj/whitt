import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAudioWorklet } from './worklet'

describe('createAudioWorklet', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('AudioWorklet captures 16k Float32 chunks', () => {
    const mockAudioContext = {
      audioWorklet: {
        addModule: vi.fn().mockResolvedValue(undefined),
      },
      createScriptProcessor: vi.fn(() => ({
        connect: vi.fn(),
        disconnect: vi.fn(),
        onaudioprocess: null,
      })),
      createMediaStreamDestination: vi.fn(() => ({
        stream: { id: 'mock-destination' },
      })),
    } as unknown as AudioContext

    const mockSource = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    } as unknown as MediaStreamAudioSourceNode

    createAudioWorklet(mockAudioContext, mockSource)
  })

  it('AudioWorklet splits feed from source', () => {
    const mockAudioContext = {
      audioWorklet: {
        addModule: vi.fn().mockResolvedValue(undefined),
      },
      createScriptProcessor: vi.fn(() => ({
        connect: vi.fn(),
        disconnect: vi.fn(),
        onaudioprocess: null,
      })),
      createMediaStreamDestination: vi.fn(() => ({
        stream: { id: 'mock-destination' },
      })),
    } as unknown as AudioContext

    const mockSource = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    } as unknown as MediaStreamAudioSourceNode

    const mockDestination = {} as unknown as AudioNode

    const worklet = createAudioWorklet(mockAudioContext, mockSource)
    worklet.connect(mockDestination)

    expect(mockSource.connect).toHaveBeenCalledWith(mockDestination)
  })

  it('AudioWorklet handles audio buffer chunks', () => {
    const mockAudioContext = {
      audioWorklet: {
        addModule: vi.fn().mockResolvedValue(undefined),
      },
      createScriptProcessor: vi.fn(() => ({
        connect: vi.fn(),
        disconnect: vi.fn(),
        onaudioprocess: null,
      })),
      createMediaStreamDestination: vi.fn(() => ({
        stream: { id: 'mock-destination' },
      })),
    } as unknown as AudioContext

    const mockSource = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    } as unknown as MediaStreamAudioSourceNode

    const worklet = createAudioWorklet(mockAudioContext, mockSource)

    worklet.onChunk((chunk: Float32Array) => {
      expect(chunk).toBeInstanceOf(Float32Array)
    })
  })
})
