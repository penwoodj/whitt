import { log } from '../../../shared/logger'

const logger = log('FakeAnalyser')

interface FakeAnalyserNode {
  fftSize: number
  frequencyBinCount: number
  getByteFrequencyData: (array: Uint8Array) => void
  getLevel: () => number
}

const createFakeAnalyser = (levelCurve: number[]): FakeAnalyserNode => {
  let currentIndex = 0

  const getByteFrequencyData = (array: Uint8Array): void => {
    const level = levelCurve.length > 0 ? levelCurve[currentIndex % levelCurve.length] : 0
    const value = Math.floor(level * 255)

    for (let i = 0; i < array.length; i++) {
      array[i] = value
    }
  }

  const getLevel = (): number => {
    if (levelCurve.length === 0) return 0
    const level = levelCurve[currentIndex % levelCurve.length]
    currentIndex++
    return level
  }

  logger.debug(`FakeAnalyser created w/ curve length: ${levelCurve.length}`)

  return {
    fftSize: 256,
    frequencyBinCount: 128,
    getByteFrequencyData,
    getLevel,
  }
}

export { createFakeAnalyser }
