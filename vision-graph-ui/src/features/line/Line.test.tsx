import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import Line from './Line'

const renderWithTheme = (ui: React.ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('Line slice', () => {
  describe('Render line btwn two coords', () => {
    it('SVG path visible', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = renderWithTheme(<Line id="test" srcCoord={srcCoord} dstCoord={dstCoord} />)
      const paths = container.querySelectorAll('path')
      expect(paths.length).toBeGreaterThan(0)
      expect(paths[0]).toBeVisible()
    })

    it('path stroke gray', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = renderWithTheme(<Line id="test" srcCoord={srcCoord} dstCoord={dstCoord} />)
      const paths = container.querySelectorAll('path')
      expect(paths[0]).toHaveAttribute('stroke', '#666666')
    })
  })

  describe('Active state widens stroke', () => {
    it('stroke-width is 4', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = renderWithTheme(<Line id="test" srcCoord={srcCoord} dstCoord={dstCoord} isActive />)
      const paths = container.querySelectorAll('path')
      expect(paths[0]).toHaveAttribute('stroke-width', '4')
    })
  })

  describe('Label shows kind', () => {
    it('label visible at midpoint', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const lineKind = 'PRODUCED' as const
      renderWithTheme(<Line id="test" srcCoord={srcCoord} dstCoord={dstCoord} lineKind={lineKind} />)
      const label = screen.getByText('PRODUCED')
      expect(label).toBeVisible()
    })

    it('label txt = "PRODUCED"', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const lineKind = 'PRODUCED' as const
      renderWithTheme(<Line id="test" srcCoord={srcCoord} dstCoord={dstCoord} lineKind={lineKind} />)
      const label = screen.getByText('PRODUCED')
      expect(label.textContent).toBe('PRODUCED')
    })
  })

  describe('Loading anim dashed', () => {
    it('stroke-dasharray set', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = renderWithTheme(<Line id="test" srcCoord={srcCoord} dstCoord={dstCoord} status="loading" />)
      const paths = container.querySelectorAll('path')
      const animPath = Array.from(paths).find(p => p.hasAttribute('stroke-dasharray'))
      expect(animPath).toHaveAttribute('stroke-dasharray', '5, 5')
    })

    it('dashoffset animates', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = renderWithTheme(<Line id="test" srcCoord={srcCoord} dstCoord={dstCoord} status="loading" />)
      const groups = container.querySelectorAll('g')
      const animGroup = Array.from(groups).find(g => g.querySelector('path'))
      expect(animGroup).toHaveStyle({ animation: expect.any(String) })
    })
  })

  describe('Click label fires callback', () => {
    it('onLabelClick called w/ "DEPENDS_ON"', () => {
      const onLabelClick = vi.fn()
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const lineKind = 'DEPENDS_ON' as const
      renderWithTheme(<Line id="test" srcCoord={srcCoord} dstCoord={dstCoord} lineKind={lineKind} onLabelClick={onLabelClick} />)
      const label = screen.getByText('DEPENDS_ON')
      label.click()
      expect(onLabelClick).toHaveBeenCalledWith('DEPENDS_ON')
    })
  })

  describe('Error state red pulse', () => {
    it('stroke color red', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = renderWithTheme(<Line id="test" srcCoord={srcCoord} dstCoord={dstCoord} status="error" />)
      const paths = container.querySelectorAll('path')
      expect(paths[1]).toHaveAttribute('stroke', '#ef4444')
    })

    it('pulse animation active', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = renderWithTheme(<Line id="test" srcCoord={srcCoord} dstCoord={dstCoord} status="error" />)
      const groups = container.querySelectorAll('g')
      const animGroup = Array.from(groups).find(g => g.querySelector('path'))
      expect(animGroup).toHaveStyle({ animation: expect.any(String) })
    })
  })
})
