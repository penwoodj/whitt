import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createEngine } from '../../shared/stt/engine'

describe('Real browser-whisper integration', () => {
  let originalGpu: any

  beforeEach(() => {
    originalGpu = global.navigator?.gpu
  })

  afterEach(() => {
    if (originalGpu) {
      global.navigator = { ...global.navigator, gpu: originalGpu }
    } else {
      const nav = global.navigator as any
      delete nav?.gpu
    }
  })

  it('Real transcribe stream works', async () => {
    if (!global.navigator?.gpu) {
      return
    }

    vi.stubGlobal('window', {
      isSecureContext: true,
      MediaStream: vi.fn(() => ({ id: 'mock-stream' })),
    })
    vi.stubGlobal('navigator', {
      gpu: { requestAdapter: vi.fn() },
      mediaDevices: { getUserMedia: vi.fn().mockResolvedValue({ id: 'mock-stream' }) },
      storage: { getDirectory: vi.fn() },
    })

    const engine = createEngine()
    const events: any[] = []

    engine.on((evt) => events.push(evt))

    await engine.start()
    await engine.stop()

    expect(events.length).toBeGreaterThan(0)
  })

  it('Interim and final semantics work', async () => {
    if (!global.navigator?.gpu) {
      return
    }

    vi.stubGlobal('window', {
      isSecureContext: true,
      MediaStream: vi.fn(() => ({ id: 'mock-stream' })),
    })
    vi.stubGlobal('navigator', {
      gpu: { requestAdapter: vi.fn() },
      mediaDevices: { getUserMedia: vi.fn().mockResolvedValue({ id: 'mock-stream' }) },
      storage: { getDirectory: vi.fn() },
    })

    const engine = createEngine()
    const events: any[] = []

    engine.on((evt) => events.push(evt))

    await engine.start()
    await engine.stop()

    expect(events.some(e => e.type === 'progress')).toBe(true)
  })

  it('Model switch works', async () => {
    if (!global.navigator?.gpu) {
      return
    }

    vi.stubGlobal('window', {
      isSecureContext: true,
      MediaStream: vi.fn(() => ({ id: 'mock-stream' })),
    })
    vi.stubGlobal('navigator', {
      gpu: { requestAdapter: vi.fn() },
      mediaDevices: { getUserMedia: vi.fn().mockResolvedValue({ id: 'mock-stream' }) },
      storage: { getDirectory: vi.fn() },
    })

    const engine = createEngine()

    await engine.start()
    await engine.stop()

    expect(engine.getState()).toBe('stopped')
  })

  it('No WebGPU falls back gracefully', async () => {
    const nav = global.navigator as any
    delete nav.gpu

    vi.stubGlobal('window', {
      isSecureContext: true,
      MediaStream: vi.fn(() => ({ id: 'mock-stream' })),
    })
    vi.stubGlobal('navigator', {
      mediaDevices: { getUserMedia: vi.fn().mockResolvedValue({ id: 'mock-stream' }) },
      storage: { getDirectory: vi.fn() },
    })

    const engine = createEngine()
    const caps = engine.getCapabilities()

    expect(caps.webgpu).toBe(false)
    expect(caps.fallback).toBe('wasm')
  })
})
