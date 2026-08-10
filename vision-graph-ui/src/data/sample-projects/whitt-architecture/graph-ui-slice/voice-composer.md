---
id: d2e3f4a5-b6c7-8901-5678-012345678901
title: Voice Composer
parent: ./index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Voice Composer

Voice composer enables natural language interaction with Whitt, transforming speech into graph actions and workflow commands.

## Speech Recognition

### Local Whisper Integration
CPU-only speech recognition:
```typescript
import { loadWhisper } from 'whisper.cpp'

const whisper = await loadWhisper('base.en')

async function transcribeAudio(audioBuffer: ArrayBuffer): Promise<string> {
  const result = await whisper.transcribe(audioBuffer)
  return result.text
}
```

### Real-time Streaming
Continuous transcription:
```typescript
class VoiceStream {
  private mediaRecorder: MediaRecorder
  private audioChunks: Blob[] = []
  
  async startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    this.mediaRecorder = new MediaRecorder(stream)
    
    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data)
    }
    
    this.mediaRecorder.start(1000) // Chunk every second
  }
  
  async stopRecording(): Promise<string> {
    this.mediaRecorder.stop()
    const audioBlob = new Blob(this.audioChunks)
    return await transcribeAudio(await audioBlob.arrayBuffer())
  }
}
```

## Intent Understanding

### Command Parsing
Extract structured commands from natural language:
```typescript
interface ParsedCommand {
  action: 'create' | 'show' | 'deploy' | 'navigate'
  target: string
  modifiers: Record<string, any>
}

function parseCommand(transcript: string): ParsedCommand {
  // Pattern matching for common commands
  const createPattern = /create (?:a )?(new )?(.+)/i
  const showPattern = /show (.+)/i
  const deployPattern = /deploy (.+) (?:to )?(.+)/i
  
  if (createPattern.test(transcript)) {
    const match = transcript.match(createPattern)
    return {
      action: 'create',
      target: match[2],
      modifiers: {}
    }
  }
  
  // ... other patterns
}
```

### Context Awareness
Understand user intent from context:
- **Current Selection**: Commands apply to selected nodes
- **Active Project**: Scope commands to current project
- **Recent History**: Learn from user patterns
- **Graph State**: Understand current graph context

## Voice-to-Graph Mapping

### Workflow Creation
Create workflows from voice:
```typescript
async function createWorkflowFromVoice(command: ParsedCommand) {
  const workflow = {
    id: generateId(),
    name: command.target,
    nodes: [
      {
        id: 'root',
        type: 'voice',
        title: command.target,
        lifecycle: 'initial',
        prompt: command.originalTranscript
      }
    ],
    edges: []
  }
  
  addNodeToGraph(workflow.nodes[0])
  startAgenticCycle(workflow.nodes[0].id)
}
```

### Graph Navigation
Navigate graph with voice:
```typescript
function navigateGraph(command: ParsedCommand) {
  switch (command.target) {
    case 'failures':
      filterNodesByStatus('failed')
      zoomToFilteredNodes()
      break
    case 'today':
      filterNodesByDate('today')
      break
    // ... other navigation commands
  }
}
```

## Visual Feedback

### Recording State
Clear visual indicators:
```typescript
const MicButton = styled.button<{ $isRecording: boolean }>`
  background: ${props => props.$isRecording 
    ? props.theme.colors.recording 
    : props.theme.colors.idle};
  animation: ${props => props.$isRecording 
    ? 'pulse 1s infinite' 
    : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`
```

### Real-time Transcription
Show transcription as it streams:
```typescript
const TranscriptionDisplay = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.colors.bgElevated};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  padding: ${props => props.theme.spacing.md};
  max-width: 600px;
`
```

### Command Confirmation
Visual feedback for recognized commands:
- **Success Animation**: Green flash when command understood
- **Error Indication**: Red flash for unrecognized commands
- **Progress Indicator**: Show command execution progress
- **Undo Capability**: Offer to undo last voice command

Voice composer transforms natural language into precise graph actions, making Whitt accessible through intuitive speech interaction while maintaining the power of visual programming.