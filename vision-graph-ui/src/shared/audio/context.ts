import { log } from '../logger'

const logger = log('AudioContext')

let audioContext: AudioContext | null = null

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new AudioContext({ sampleRate: 16000 })
    logger.debug('AudioContext created @16kHz')
  }
  return audioContext
}

const resumeAudioContext = async (): Promise<void> => {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
    logger.debug('AudioContext resumed')
  }
}

const destroyAudioContext = (): void => {
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close()
    logger.debug('AudioContext destroyed')
  }
  audioContext = null
}

export { getAudioContext, resumeAudioContext, destroyAudioContext }
