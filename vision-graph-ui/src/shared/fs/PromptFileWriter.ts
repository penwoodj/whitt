import type { WriteQueue } from './WriteQueue'

export type PromptMetadata = {
  nodeId: string
  createdAt: string
  sentAt?: string
}

export class PromptFileWriter {
  private readonly writeQueue: WriteQueue
  private readonly getNodeDir: (nodeId: string) => string

  constructor(
    writeQueue: WriteQueue,
    getNodeDir: (nodeId: string) => string
  ) {
    this.writeQueue = writeQueue
    this.getNodeDir = getNodeDir
  }

  async writePrompt(nodeId: string, prompt: string): Promise<void> {
    const nodeDir = this.getNodeDir(nodeId)
    const timestamp = new Date().toISOString()
    const slug = nodeId.replace(/[^a-z0-9]/gi, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '')
    const filename = `${timestamp}-${slug}.md`
    const filePath = `${nodeDir}/.prompts/${filename}`

    const metadata: PromptMetadata = {
      nodeId,
      createdAt: timestamp,
      sentAt: timestamp
    }

    const content = this.formatPromptFile(metadata, prompt)
    this.writeQueue.write(filePath, content)
  }

  private formatPromptFile(metadata: PromptMetadata, prompt: string): string {
    const frontmatter = Object.entries(metadata)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join('\n')

    return `---\n${frontmatter}\n---\n\n${prompt}`
  }
}
