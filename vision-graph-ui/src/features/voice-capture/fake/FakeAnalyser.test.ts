import { describe, it, expect, beforeEach } from 'vitest'
import { createFakeAnalyser } from './FakeAnalyser'

describe('FakeAnalyser', () => {
  it('FakeAnalyser emits level curve', () => {
    const curve = [0.1, 0.5, 0.8, 0.3]
    const analyser = createFakeAnalyser(curve)

    const level1 = analyser.getLevel()
    const level2 = analyser.getLevel()
    const level3 = analyser.getLevel()
    const level4 = analyser.getLevel()
    const level5 = analyser.getLevel()

    expect(level1).toBe(0.1)
    expect(level2).toBe(0.5)
    expect(level3).toBe(0.8)
    expect(level4).toBe(0.3)
    expect(level5).toBe(0.1)
  })

  it('FakeAnalyser compatible w/ real AnalyserNode', () => {
    const analyser = createFakeAnalyser([0.5])

    expect(analyser.fftSize).toBe(256)
    expect(analyser.frequencyBinCount).toBe(128)

    const dataArray = new Uint8Array(128)
    analyser.getByteFrequencyData(dataArray)

    expect(dataArray[0]).toBeGreaterThan(0)
  })

  it('FakeAnalyser handles empty curve', () => {
    const analyser = createFakeAnalyser([])

    const level = analyser.getLevel()

    expect(level).toBe(0)
  })
})
