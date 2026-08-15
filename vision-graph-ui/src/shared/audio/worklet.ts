import { log } from '../logger'

const logger = log('AudioWorklet')

export interface AudioWorkletNode {
  connect(destination: AudioNode): void
  disconnect(): void
  onChunk(callback: (chunk: Float32Array) => void): void
  start(): void
  stop(): void
}

export const createAudioWorklet = (
  _audioContext: AudioContext,
  source: MediaStreamAudioSourceNode,
): AudioWorkletNode => {
  let _chunkCallback: ((chunk: Float32Array) => void) | null = null
  let _isRunning = false

  const connect = (destination: AudioNode): void => {
    source.connect(destination)
    logger.debug('AudioWorklet connected to source')
  }

  const disconnect = (): void => {
    source.disconnect()
    logger.debug('AudioWorklet disconnected from source')
  }

  const onChunk = (callback: (chunk: Float32Array) => void): void => {
    _chunkCallback = callback
    logger.debug('AudioWorklet chunk callback registered')
  }

  const start = (): void => {
    _isRunning = true
    logger.debug('AudioWorklet started')
  }

  const stop = (): void => {
    _isRunning = false
    logger.debug('AudioWorklet stopped')
  }

  return { connect, disconnect, onChunk, start, stop }
}
