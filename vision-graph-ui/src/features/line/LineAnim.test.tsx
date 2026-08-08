import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import LineAnim from './LineAnim'

describe('LineAnim', () => {
  describe('Loading anim dashed', () => {
    it('stroke-dasharray set', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = render(<LineAnim srcCoord={srcCoord} dstCoord={dstCoord} status="loading" />)
      const path = container.querySelector('path')
      expect(path).toHaveAttribute('stroke-dasharray', '5, 5')
    })

    it('dashoffset animates', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = render(<LineAnim srcCoord={srcCoord} dstCoord={dstCoord} status="loading" />)
      const path = container.querySelector('path')
      expect(path).toHaveStyle({ animation: 'dashoffset 1s linear infinite' })
    })
  })

  describe('Done state solid', () => {
    it('stroke solid', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = render(<LineAnim srcCoord={srcCoord} dstCoord={dstCoord} status="done" />)
      const path = container.querySelector('path')
      expect(path).toHaveAttribute('stroke-dasharray', 'none')
    })
  })

  describe('Error state red pulse', () => {
    it('stroke color red', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = render(<LineAnim srcCoord={srcCoord} dstCoord={dstCoord} status="error" />)
      const path = container.querySelector('path')
      expect(path).toHaveAttribute('stroke', '#ff0000')
    })

    it('pulse animation active', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = render(<LineAnim srcCoord={srcCoord} dstCoord={dstCoord} status="error" />)
      const path = container.querySelector('path')
      expect(path).toHaveStyle({ animation: 'pulse 1s ease-in-out infinite' })
    })
  })
})
