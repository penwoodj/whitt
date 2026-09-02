import { describe, expect, it } from 'vitest'
import { createLocalSttEngine } from './BrowserWhisperAdapter'

describe('BrowserWhisper adapter', () => {
  it('exposes project-owned seam without library internals', () => {
    expect(createLocalSttEngine).toBeTypeOf('function')
  })
})
