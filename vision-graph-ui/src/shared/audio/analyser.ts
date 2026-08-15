import { log } from '../logger'

const logger = log('Analyser')

const createAnalyser = (source: MediaStreamAudioSourceNode): AnalyserNode => {
  const analyser = source.context.createAnalyser()
  analyser.fftSize = 256
  source.connect(analyser)
  logger.debug('AnalyserNode created w/ fftSize 256')
  return analyser
}

const getAnalyserLevel = (analyser: AnalyserNode): number => {
  const dataArray = new Uint8Array(analyser.frequencyBinCount)
  analyser.getByteFrequencyData(dataArray)

  let sum = 0
  for (let i = 0; i < dataArray.length; i++) {
    const normalized = dataArray[i] / 255
    sum += normalized * normalized
  }

  const rms = Math.sqrt(sum / dataArray.length)
  return Math.min(1, rms * 3)
}

export { createAnalyser, getAnalyserLevel }
