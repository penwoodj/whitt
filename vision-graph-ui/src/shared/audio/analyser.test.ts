import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createAnalyser, getAnalyserLevel } from './analyser'
import { getAudioContext, destroyAudioContext } from './context'

class MockAudioContext {
  sampleRate = 16000
  state: 'suspended' | 'running' = 'running'
  close = vi.fn().mockResolvedValue(undefined)
  resume = vi.fn().mockResolvedValue(undefined)
  createMediaStreamSource = vi.fn()
  createAnalyser = vi.fn()
}

class MockSource implements Partial<MediaStreamAudioSourceNode> {
  mediaStream: MediaStream
  channelCount = 2
  channelCountMode = 'max' as const
  channelInterpretation = 'speakers' as const
  connect = vi.fn()
  disconnect = vi.fn()
  context = mockAudioContext

  constructor() {
    this.mediaStream = new (global.MediaStream || class {})() as MediaStream
  }
}

const mockAnalyser = {
  fftSize: 256,
  frequencyBinCount: 128,
  getByteFrequencyData: vi.fn(),
  connect: vi.fn(),
}

const mockAudioContext = new MockAudioContext()
const mockSource = new MockSource()

describe('AnalyserNode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.AudioContext = MockAudioContext as any
    global.MediaStream = class {} as any
    mockAudioContext.createMediaStreamSource.mockReturnValue(mockSource)
    mockAudioContext.createAnalyser.mockReturnValue(mockAnalyser)
  })

  afterEach(() => {
    destroyAudioContext()
    vi.restoreAllMocks()
  })

  it('AnalyserNode w/ fftSize 256', () => {
    const ctx = getAudioContext()
    const mockStream = new MediaStream()
    ctx.createMediaStreamSource(mockStream)
    const source = mockSource
    const analyser = createAnalyser(source)

    expect(analyser.fftSize).toBe(256)
    expect(source.connect).toHaveBeenCalledWith(analyser)
  })

  it('Analyser level calc 0-1', () => {
    const ctx = getAudioContext()
    const mockStream = new MediaStream()
    ctx.createMediaStreamSource(mockStream)
    const source = mockSource
    const analyser = createAnalyser(source)

    const mockData = new Uint8Array([100, 50, 25])
    mockAnalyser.getByteFrequencyData.mockImplementation((array: Uint8Array) => {
      array.set(mockData)
    })

    const level = getAnalyserLevel(analyser)
    expect(level).toBeGreaterThanOrEqual(0)
    expect(level).toBeLessThanOrEqual(1)
    expect(mockAnalyser.getByteFrequencyData).toHaveBeenCalled()
  })

  it('One source split to analyser', () => {
    const ctx = getAudioContext()
    const mockStream = new MediaStream()
    ctx.createMediaStreamSource(mockStream)
    const source = mockSource
    const analyser = createAnalyser(source)

    expect(analyser).toBeDefined()
    expect(source.connect).toHaveBeenCalledWith(analyser)
  })
})
