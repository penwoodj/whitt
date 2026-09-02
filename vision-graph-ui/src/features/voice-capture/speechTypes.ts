export type SpeechStatus =
  | 'idle'
  | 'permission-pending'
  | 'listening'
  | 'processing'
  | 'denied'
  | 'error'
  | 'stopped'

export type LocalSttSegment = {
  text: string
  start: number
  end: number
}

type SpeechData = {
  text: string
  interim: string
  segments: LocalSttSegment[]
  amplitude: number
  isStatic: boolean
  error?: string
}

export type SpeechState = SpeechData & { state: SpeechStatus }

export type SpeechEvent =
  | { type: 'permission-requested' }
  | { type: 'permission-granted' }
  | { type: 'permission-denied'; message: string }
  | { type: 'unsupported'; message: string }
  | { type: 'interim'; text: string }
  | { type: 'segment'; segment: LocalSttSegment }
  | { type: 'stop-requested' }
  | { type: 'stopped' }
  | { type: 'error'; message: string }
  | { type: 'amplitude'; level: number }
  | { type: 'motion'; reduced: boolean }

export const initialSpeechState: SpeechState = {
  state: 'idle',
  text: '',
  interim: '',
  segments: [],
  amplitude: 0,
  isStatic: false,
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled speech event: ${JSON.stringify(value)}`)
}

const orderSegments = (segments: LocalSttSegment[]): LocalSttSegment[] =>
  [...segments].sort((first, second) => first.start - second.start)

const joinSegments = (segments: LocalSttSegment[]): string =>
  orderSegments(segments).map((segment) => segment.text.trim()).filter(Boolean).join(' ')

export const reduceSpeech = (state: SpeechState, event: SpeechEvent): SpeechState => {
  switch (event.type) {
    case 'permission-requested':
      return { ...state, state: 'permission-pending', error: undefined }
    case 'permission-granted':
      return { ...state, state: 'listening', error: undefined }
    case 'permission-denied':
      return { ...state, state: 'denied', error: event.message }
    case 'unsupported':
      return { ...state, state: 'error', error: event.message }
    case 'interim':
      return { ...state, interim: event.text }
    case 'segment': {
      const segments = orderSegments([...state.segments, event.segment])
      const text = joinSegments(segments)
      const isStopped = state.state === 'processing'
      return { ...state, state: isStopped ? 'stopped' : state.state, segments, text, interim: '' }
    }
    case 'stop-requested':
      return { ...state, state: state.state === 'listening' ? 'processing' : state.state }
    case 'stopped':
      return { ...state, state: 'stopped', amplitude: 0 }
    case 'error':
      return { ...state, state: 'error', error: event.message }
    case 'amplitude':
      return { ...state, amplitude: Math.max(0, Math.min(1, event.level)) }
    case 'motion':
      return { ...state, isStatic: event.reduced }
    default:
      return assertNever(event)
  }
}

export type CaptureSessionResources = {
  stream: MediaStream
  context: AudioContext
  analyser: AnalyserNode
  processor: AudioWorkletNode
}

export const cleanupCapture = (resources: CaptureSessionResources): void => {
  resources.processor.disconnect()
  resources.analyser.disconnect()
  resources.stream.getTracks().forEach((track) => {
    track.stop()
  })
  if (resources.context.state !== 'closed') {
    void resources.context.close()
  }
}
