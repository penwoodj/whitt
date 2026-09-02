import { getAnalyserLevel } from '../../shared/audio/analyser'
import type { LocalSttEngine } from './LocalSttEngine'
import { cleanupCapture, type CaptureSessionResources, type LocalSttSegment } from './speechTypes'

export type CaptureHandle = {
  stop: () => AsyncIterable<LocalSttSegment>
  cancel: () => void
  readAmplitude: () => number
}

export type CaptureFactory = {
  getUserMedia: () => Promise<MediaStream>
  createContext: () => AudioContext
  createProcessor: (context: AudioContext) => Promise<AudioWorkletNode>
}

const workletSource = 'class PCMProcessor extends AudioWorkletProcessor { process(inputs) { const channel = inputs[0]?.[0]; if (channel) this.port.postMessage(new Float32Array(channel)); return true } } registerProcessor("local-stt-pcm", PCMProcessor)'

const browserCaptureFactory: CaptureFactory = {
  getUserMedia: () => navigator.mediaDevices.getUserMedia({ audio: true }),
  createContext: () => new AudioContext({ sampleRate: 16000 }),
  createProcessor: async (context) => {
    const blob = new Blob([workletSource], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    await context.audioWorklet.addModule(url)
    URL.revokeObjectURL(url)
    return new AudioWorkletNode(context, 'local-stt-pcm')
  },
}

let activeCapture: CaptureHandle | null = null

export const createCapture = async (
  engine: LocalSttEngine,
  factory: CaptureFactory = browserCaptureFactory,
): Promise<CaptureHandle> => {
  activeCapture?.cancel()
  const stream = await factory.getUserMedia()
  const context = factory.createContext()
  const source = context.createMediaStreamSource(stream)
  const analyser = context.createAnalyser()
  analyser.fftSize = 256
  const processor = await factory.createProcessor(context)
  const samples: Float32Array[] = []
  source.connect(analyser)
  source.connect(processor)
  processor.connect(context.destination)
  processor.port.onmessage = (event: MessageEvent<Float32Array>) => {
    samples.push(new Float32Array(event.data))
  }
  await engine.start(undefined, stream)
  const resources: CaptureSessionResources = { stream, context, analyser, processor }
  const collectSamples = (): Float32Array => {
    const length = samples.reduce((total, chunk) => total + chunk.length, 0)
    const pcm = new Float32Array(length)
    let offset = 0
    samples.forEach((chunk) => {
      pcm.set(chunk, offset)
      offset += chunk.length
    })
    return pcm
  }
  const stop = (): ReturnType<LocalSttEngine['transcribePCM']> => {
    cleanupCapture(resources)
    activeCapture = null
    const result = engine.transcribePCM(collectSamples())
    return (async function* (): AsyncIterable<LocalSttSegment> {
      try {
        yield* result
      } finally {
        engine.dispose()
      }
    })()
  }
  const cancel = (): void => {
    cleanupCapture(resources)
    engine.cancel()
    engine.dispose()
    activeCapture = null
  }
  const handle: CaptureHandle = { stop, cancel, readAmplitude: () => getAnalyserLevel(analyser) }
  activeCapture = handle
  return handle
}
