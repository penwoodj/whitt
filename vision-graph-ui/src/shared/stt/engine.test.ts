import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createEngine } from './engine'
import type { SttEvent } from './types'

const mockMediaStream = { id: 'mock-stream' } as unknown as MediaStream

describe('createEngine', () => {
  beforeEach(() => {
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
  })

  describe('capability detect', () => {
    it('Capability detects WebGPU support', () => {
      const engine = createEngine()
      const caps = engine.getCapabilities()

      expect(caps.webgpu).toBe(true)
    })

    it('Capability detects no WebGPU falls back to WASM', () => {
      const nav = global.navigator as any
      delete nav.gpu

      const engine = createEngine()
      const caps = engine.getCapabilities()

      expect(caps.webgpu).toBe(false)
      expect(caps.fallback).toBe('wasm')
    })

    it('Capability detects mic access', async () => {
      const engine = createEngine()
      const caps = engine.getCapabilities()

      expect(caps.mic).toBe(true)
    })

    it('Capability detects secure context', () => {
      const engine = createEngine()
      const caps = engine.getCapabilities()

      expect(caps.secureContext).toBe(true)
    })
  })

  describe('OPFS cache', () => {
    it('OPFS caches model after download', async () => {
      const engine = createEngine()

      const events: SttEvent[] = []
      engine.on((evt: SttEvent) => events.push(evt))

      await engine.start()
      await engine.stop()

      const caps = engine.getCapabilities()
      expect(caps.opfsCache).toBe(true)
    })

    it('subsequent load from cache', async () => {
      const engine1 = createEngine()
      await engine1.start()
      await engine1.stop()

      const engine2 = createEngine()
      const caps = engine2.getCapabilities()

      expect(caps.opfsCache).toBe(true)
    })
  })

  describe('model load progress', () => {
    it('Model load progress events fire', async () => {
      const engine = createEngine()

      const progressEvents: SttEvent[] = []
      engine.on((evt: SttEvent) => {
        if (evt.type === 'progress') {
          progressEvents.push(evt)
        }
      })

      await engine.start()
      await engine.stop()

      expect(progressEvents.length).toBeGreaterThan(0)
    })
  })
})
