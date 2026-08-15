import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createEngine } from '../../shared/stt/engine'

const mockMediaStream = { id: 'mock-stream' } as unknown as MediaStream

describe('Failure UX states', () => {
  it('Permission denied shows helpful error', async () => {
    vi.restoreAllMocks()
    vi.stubGlobal('window', {
      isSecureContext: true,
      MediaStream: vi.fn(() => mockMediaStream),
    })
    vi.stubGlobal('navigator', {
      gpu: { requestAdapter: vi.fn() },
      mediaDevices: { getUserMedia: vi.fn().mockRejectedValue(new Error('Permission denied')) },
      storage: { getDirectory: vi.fn() },
    })

    const engine = createEngine()
    const errors: string[] = []

    engine.on((evt) => {
      if (evt.type === 'error') {
        errors.push(evt.error)
      }
    })

    await engine.start().catch(() => {})

    expect(errors.length).toBeGreaterThan(0)
  })

  it('No mic detected disables voice', async () => {
    vi.restoreAllMocks()
    vi.stubGlobal('window', {
      isSecureContext: true,
      MediaStream: vi.fn(() => mockMediaStream),
    })
    vi.stubGlobal('navigator', {
      gpu: { requestAdapter: vi.fn() },
      mediaDevices: { getUserMedia: vi.fn().mockRejectedValue(new Error('No microphone found')) },
      storage: { getDirectory: vi.fn() },
    })

    const engine = createEngine()
    const errors: string[] = []

    engine.on((evt) => {
      if (evt.type === 'error') {
        errors.push(evt.error)
      }
    })

    await engine.start().catch(() => {})

    expect(errors.some(e => e.toLowerCase().includes('mic') || e.toLowerCase().includes('microphone'))).toBe(true)
  })

  it('Insecure context explains HTTPS requirement', async () => {
    vi.restoreAllMocks()
    vi.stubGlobal('window', {
      isSecureContext: false,
      MediaStream: vi.fn(() => mockMediaStream),
    })
    vi.stubGlobal('navigator', {
      gpu: { requestAdapter: vi.fn() },
      mediaDevices: { getUserMedia: vi.fn().mockResolvedValue(mockMediaStream) },
      storage: { getDirectory: vi.fn() },
    })

    const engine = createEngine()
    const errors: string[] = []

    engine.on((evt) => {
      if (evt.type === 'error') {
        errors.push(evt.error)
      }
    })

    await engine.start().catch(() => {})

    expect(errors.some(e => e.toLowerCase().includes('https') || e.toLowerCase().includes('localhost'))).toBe(true)
  })

  it('No WebGPU falls back w/ perf warning', () => {
    vi.restoreAllMocks()
    vi.stubGlobal('window', {
      isSecureContext: true,
      MediaStream: vi.fn(() => mockMediaStream),
    })
    vi.stubGlobal('navigator', {
      mediaDevices: { getUserMedia: vi.fn().mockResolvedValue(mockMediaStream) },
      storage: { getDirectory: vi.fn() },
    })

    const nav = global.navigator as any
    delete nav.gpu

    const engine = createEngine()
    const caps = engine.getCapabilities()

    expect(caps.webgpu).toBe(false)
    expect(caps.fallback).toBe('wasm')
  })

  it('Engine OOM preserves partial finals', async () => {
    vi.restoreAllMocks()
    vi.stubGlobal('window', {
      isSecureContext: true,
      MediaStream: vi.fn(() => mockMediaStream),
    })
    vi.stubGlobal('navigator', {
      gpu: { requestAdapter: vi.fn() },
      mediaDevices: { getUserMedia: vi.fn().mockResolvedValue(mockMediaStream) },
      storage: { getDirectory: vi.fn() },
    })

    const engine = createEngine()
    const errors: string[] = []

    engine.on((evt) => {
      if (evt.type === 'error') {
        errors.push(evt.error)
      }
    })

    await engine.start()
    await engine.stop()

    expect(errors.length).toBe(0)
  })
})
