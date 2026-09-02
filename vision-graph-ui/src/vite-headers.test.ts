import { describe, expect, it } from 'vitest'
import config from '../vite.config'

describe('Vite isolation headers', () => {
  it('sets COOP and COEP for dev and preview', () => {
    expect(config.server?.headers).toEqual({
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    })
    expect(config.preview?.headers).toEqual(config.server?.headers)
  })
})
