import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { getAudioContext } from '../../shared/audio/context'
import { createFakeSttEngine } from './fake/FakeSttEngine'
import { createFakeAnalyser } from './fake/FakeAnalyser'
import { useState, useEffect } from 'react'

type VoiceCaptureProps = {
  showRealAudio: boolean
  showFakeEngine: boolean
  showFakeAnalyser: boolean
}

const VoiceCapture = ({ showRealAudio, showFakeEngine, showFakeAnalyser }: VoiceCaptureProps) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [transcript, setTranscript] = useState<string>('')
  const [interimText, setInterimText] = useState<string>('')
  const [level, setLevel] = useState<number>(0)

  useEffect(() => {
    if (showRealAudio) {
      const ctx = getAudioContext()
      setAudioContext(ctx)
    }
  }, [showRealAudio])

  useEffect(() => {
    if (showFakeAnalyser) {
      const analyser = createFakeAnalyser([0.1, 0.5, 0.8, 0.3, 0.6])
      const interval = setInterval(() => {
        setLevel(analyser.getLevel())
      }, 100)
      return () => clearInterval(interval)
    }
  }, [showFakeAnalyser])

  useEffect(() => {
    if (showFakeEngine) {
      const engine = createFakeSttEngine(['Hello', 'World', 'Voice', 'Capture'])
      engine.on((evt) => {
        if (evt.type === 'interim') {
          setInterimText(evt.text)
        } else if (evt.type === 'final') {
          setTranscript((prev) => (prev ? `${prev} ${evt.text}` : evt.text))
          setInterimText('')
        }
      })
      engine.start()
      return () => {
        engine.stop()
      }
    }
  }, [showFakeEngine])

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '600px' }}>
      <h2>Voice Capture</h2>
      {showRealAudio && audioContext && (
        <div>
          <div>Audio Context: {audioContext.state}</div>
          <div>Sample Rate: {audioContext.sampleRate} Hz</div>
        </div>
      )}
      {showFakeEngine && (
        <div style={{ marginTop: '20px' }}>
          <h3>Fake STT Engine</h3>
          <div>Final Transcript:</div>
          <div style={{ minHeight: '40px', background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
            {transcript || '(waiting for speech...)'}
          </div>
          <div>Interim Text:</div>
          <div style={{ minHeight: '20px', color: '#666', fontStyle: 'italic' }}>
            {interimText || '(no interim text)'}
          </div>
        </div>
      )}
      {showFakeAnalyser && (
        <div style={{ marginTop: '20px' }}>
          <h3>Fake Analyser (Breathing Curve)</h3>
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
      )}
    </div>
  )
}

const meta: Meta<VoiceCaptureProps> = {
  title: 'Voice Capture/Voice Capture',
  component: VoiceCapture,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    showRealAudio: { control: 'boolean', defaultValue: false },
    showFakeEngine: { control: 'boolean', defaultValue: false },
    showFakeAnalyser: { control: 'boolean', defaultValue: false },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta

type Story = StoryObj<VoiceCaptureProps>

export const AudioContextSingleton: Story = {
  args: { showRealAudio: true, showFakeEngine: false, showFakeAnalyser: false },
}

export const FakeSTTScriptedFlow: Story = {
  args: { showRealAudio: false, showFakeEngine: true, showFakeAnalyser: false },
}

export const FakeAnalyserBreathingCurve: Story = {
  args: { showRealAudio: false, showFakeEngine: false, showFakeAnalyser: true },
}

export const FullFakeStack: Story = {
  args: { showRealAudio: true, showFakeEngine: true, showFakeAnalyser: true },
}
