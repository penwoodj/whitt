import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import LineAnim from './LineAnim'

const renderWithTheme = (ui: React.ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('LineAnim', () => {
  describe('Loading anim dashed', () => {
    it('stroke-dasharray set', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = renderWithTheme(<LineAnim srcCoord={srcCoord} dstCoord={dstCoord} status="loading" />)
      const path = container.querySelector('path')
      expect(path).toHaveAttribute('stroke-dasharray', '5, 5')
    })

    it('dashoffset animates', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = renderWithTheme(<LineAnim srcCoord={srcCoord} dstCoord={dstCoord} status="loading" />)
      const group = container.querySelector('g')
      expect(group).toHaveStyle({ animation: expect.any(String) })
    })
  })

  describe('Done state solid', () => {
    it('stroke solid', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = renderWithTheme(<LineAnim srcCoord={srcCoord} dstCoord={dstCoord} status="done" />)
      const path = container.querySelector('path')
      expect(path).toHaveAttribute('stroke-dasharray', 'none')
    })
  })

  describe('Error state red pulse', () => {
    it('stroke color red', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = renderWithTheme(<LineAnim srcCoord={srcCoord} dstCoord={dstCoord} status="error" />)
      const path = container.querySelector('path')
      expect(path).toHaveAttribute('stroke', '#ff0000')
    })

    it('pulse animation active', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = renderWithTheme(<LineAnim srcCoord={srcCoord} dstCoord={dstCoord} status="error" />)
      const group = container.querySelector('g')
      expect(group).toHaveStyle({ animation: expect.any(String) })
    })
  })
})
