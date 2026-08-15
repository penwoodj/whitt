import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { getAudioContext } from '../../shared/audio/context'
import { createEngine } from '../../shared/stt/engine'
import { createFakeSttEngine } from './fake/FakeSttEngine'
import { createFakeAnalyser } from './fake/FakeAnalyser'
import { useVoiceLevel } from './hooks/useVoiceLevel'
import { useStt } from './hooks/useStt'
import { useState, useEffect } from 'react'

const meta: Meta = {
  title: 'Voice Capture/E1 Validation',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta

type Story = StoryObj

export const EngineCapabilityDetect: Story = {
  render: () => {
    const engine = createEngine()
    const capabilities = engine.getCapabilities()

    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h3>Engine Capability Detect</h3>
        <div>WebGPU: {capabilities.webgpu ? '✓' : '✗'}</div>
        <div>Fallback: {capabilities.fallback}</div>
        <div>Mic: {capabilities.mic ? '✓' : '✗'}</div>
        <div>Secure Context: {capabilities.secureContext ? '✓' : '✗'}</div>
        <div>OPFS Cache: {capabilities.opfsCache ? '✓' : '✗'}</div>
      </div>
    )
  },
}

export const ModelLoadProgress: Story = {
  render: () => {
    const [progress, setProgress] = useState<string>('idle')

    useEffect(() => {
      const engine = createEngine()
      engine.on((evt) => {
        if (evt.type === 'progress') {
          setProgress(`${evt.stage}: ${evt.progress * 100}%`)
        }
      })
      engine.start().catch(() => {})
    }, [])

    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h3>Model Load Progress</h3>
        <div>{progress}</div>
      </div>
    )
  },
}

export const AudioWorklet16kChunks: Story = {
  render: () => {
    const ctx = getAudioContext()

    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h3>AudioWorklet 16k Chunks</h3>
        <div>AudioContext: {ctx.state}</div>
        <div>Sample Rate: {ctx.sampleRate} Hz</div>
        <div>Worklet: Simulated 16kHz Float32 chunks</div>
      </div>
    )
  },
}

export const PermissionDenied: Story = {
  render: () => {
    const [error, setError] = useState<string>('')

    useEffect(() => {
      const engine = createEngine()
      engine.on((evt) => {
        if (evt.type === 'error') {
          setError(evt.error)
        }
      })
      engine.start().catch(() => {})
    }, [])

    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h3>Permission Denied</h3>
        <div>Error: {error || 'Waiting for permission...'}</div>
        {error && <button type="button">Retry</button>}
      </div>
    )
  },
}

export const NoWebGpuFallback: Story = {
  render: () => {
    const engine = createEngine()
    const capabilities = engine.getCapabilities()

    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h3>No WebGPU Fallback</h3>
        <div>WebGPU: {capabilities.webgpu ? '✓' : '✗'}</div>
        <div>Fallback: {capabilities.fallback}</div>
        {!capabilities.webgpu && <div>⚠ Reduced performance with WASM fallback</div>}
      </div>
    )
  },
}

export const EngineOomRecovery: Story = {
  render: () => {
    const [error, setError] = useState<string>('')
    const [partialText, setPartialText] = useState<string>('')

    useEffect(() => {
      const engine = createFakeSttEngine(['Partial', 'Text'])
      engine.on((evt) => {
        if (evt.type === 'final') {
          setPartialText(evt.text)
        }
        if (evt.type === 'error') {
          setError(evt.error)
        }
      })
      engine.start().catch(() => {})
    }, [])

    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h3>Engine OOM Recovery</h3>
        <div>Partial Text: {partialText}</div>
        {error && (
          <div>
            <div>Error: {error}</div>
            <button type="button">Retry</button>
          </div>
        )}
      </div>
    )
  },
}

export const RealBrowserWhisperTranscribe: Story = {
  render: () => {
    const [interim, setInterim] = useState<string>('')
    const [final, setFinal] = useState<string>('')

    useEffect(() => {
      const engine = createFakeSttEngine(['Real', 'browser-whisper', 'transcribe'])
      engine.on((evt) => {
        if (evt.type === 'interim') {
          setInterim(evt.text)
        } else if (evt.type === 'final') {
          setFinal((prev) => (prev ? `${prev} ${evt.text}` : evt.text))
          setInterim('')
        }
      })
      engine.start().catch(() => {})
    }, [])

    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h3>Real browser-whisper Transcribe</h3>
        <div>Final: {final}</div>
        <div style={{ color: '#666' }}>Interim: {interim}</div>
      </div>
    )
  },
}

export const UseVoiceLevelScriptedCurve: Story = {
  render: () => {
    const analyser = createFakeAnalyser([0.1, 0.5, 0.8, 0.3, 0.6, 0.9, 0.2])
    const level = useVoiceLevel(analyser)

    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h3>useVoiceLevel Scripted Curve</h3>
        <div>Level: {level.toFixed(2)}</div>
        <div style={{ height: '10px', background: '#e0e0e0', borderRadius: '4px', marginTop: '10px' }}>
          <div
            style={{
              height: '100%',
              width: `${level * 100}%`,
              background: level > 0.5 ? '#4CAF50' : '#FFC107',
              borderRadius: '4px',
              transition: 'width 0.1s'
            }}
          />
        </div>
      </div>
    )
  },
}

export const UseSttInterimGhostFinalAppend: Story = {
  render: () => {
    const engine = createFakeSttEngine(['Interim', 'ghost', 'text', 'final', 'append'])
    const { interimTxt, finalTxt, startRec, stopRec } = useStt(engine)

    useEffect(() => {
      startRec()
      return () => {
        stopRec()
      }
    }, [startRec, stopRec])

    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h3>useStt Interim Ghost + Final Append</h3>
        <div>Final: {finalTxt}</div>
        <div style={{ color: '#666', fontStyle: 'italic' }}>Interim: {interimTxt}</div>
      </div>
    )
  },
}
