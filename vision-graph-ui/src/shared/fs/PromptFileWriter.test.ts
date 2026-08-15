import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PromptFileWriter } from './PromptFileWriter'
import { WriteQueue } from './WriteQueue'

describe('PromptFileWriter', () => {
  let writeQueue: WriteQueue
  let getNodeDir: vi.Mock
  let writer: PromptFileWriter

  beforeEach(() => {
    writeQueue = new WriteQueue(vi.fn())
    getNodeDir = vi.fn()
    writer = new PromptFileWriter(writeQueue, getNodeDir)
  })

  describe('writePrompt', () => {
    it('queues write with correct path', async () => {
      getNodeDir.mockReturnValue('topic')
      vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2026-08-15T00:00:00.000Z')

      await writer.writePrompt('test-node', 'test prompt')

      const pending = writeQueue.getPendingWrites()
      expect(pending).toHaveLength(1)
      expect(pending[0].path).toContain('topic/.prompts/')
      expect(pending[0].path).toContain('2026-08-15T00:00:00.000Z-test-node.md')
    })

    it('includes YAML frontmatter with nodeId', async () => {
      getNodeDir.mockReturnValue('topic')
      vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2026-08-15T00:00:00.000Z')

      await writer.writePrompt('node-123', 'prompt text')

      const pending = writeQueue.getPendingWrites()
      const content = pending[0].content

      expect(content).toContain('nodeId: "node-123"')
      expect(content).toContain('createdAt: "2026-08-15T00:00:00.000Z"')
    })

    it('preserves prompt body in file', async () => {
      getNodeDir.mockReturnValue('topic')
      vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2026-08-15T00:00:00.000Z')

      const prompt = '# Header\n- List item'
      await writer.writePrompt('test-node', prompt)

      const pending = writeQueue.getPendingWrites()
      const content = pending[0].content

      expect(content).toContain('# Header')
      expect(content).toContain('- List item')
    })

    it('generates slug from nodeId', async () => {
      getNodeDir.mockReturnValue('topic')
      vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2026-08-15T00:00:00.000Z')

      await writer.writePrompt('Test Node_123!', 'prompt')

      const pending = writeQueue.getPendingWrites()
      expect(pending[0].path).toContain('test-node-123.md')
    })
  })
})
