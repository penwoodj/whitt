import { describe, expect, it } from 'vitest'
import { createFakeLocalSttEngine } from './LocalSttEngine'

describe('LocalSttEngine fake', () => {
  it('yields deterministic segments and errors', async () => {
    const engine = createFakeLocalSttEngine({
      segments: [{ text: 'hello', start: 0, end: 1 }],
      amplitude: [0, 0.5, 1],
    })
    await engine.start()
    const segments = []
    for await (const segment of engine.transcribePCM(new Float32Array([0]))) segments.push(segment)
    expect(segments).toEqual([{ text: 'hello', start: 0, end: 1 }])
    expect(engine.readAmplitude()).toEqual([0, 0.5, 1])
  })

  it('supports deterministic model preload seam', async () => {
    const engine = createFakeLocalSttEngine({ segments: [] })
    await expect(engine.preloadModel()).resolves.toBeUndefined()
  })

  it('cancels and disposes once', async () => {
    const engine = createFakeLocalSttEngine({ segments: [] })
    await engine.start()
    engine.cancel()
    engine.dispose()
    expect(engine.getState()).toBe('stopped')
    expect(engine.cleanupCount()).toBe(2)
  })

  it('transfers active recorder before new start', async () => {
    const first = createFakeLocalSttEngine({ segments: [] })
    const second = createFakeLocalSttEngine({ segments: [] })
    await first.start()
    await second.start(first)
    expect(first.getState()).toBe('stopped')
    expect(second.getState()).toBe('listening')
  })
})
