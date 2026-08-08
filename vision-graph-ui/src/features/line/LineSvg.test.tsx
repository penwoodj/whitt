import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import LineSvg from './LineSvg'

describe('LineSvg', () => {
  describe('Render line btwn two coords', () => {
    it('SVG path visible', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = render(<LineSvg srcCoord={srcCoord} dstCoord={dstCoord} />)
      const path = container.querySelector('path')
      expect(path).toBeVisible()
    })

    it('path stroke gray', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = render(<LineSvg srcCoord={srcCoord} dstCoord={dstCoord} />)
      const path = container.querySelector('path')
      expect(path).toHaveAttribute('stroke', '#666666')
    })
  })

  describe('Active state widens stroke', () => {
    it('stroke-width is 4', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = render(<LineSvg srcCoord={srcCoord} dstCoord={dstCoord} isActive />)
      const path = container.querySelector('path')
      expect(path).toHaveAttribute('stroke-width', '4')
    })
  })

  describe('Hover darker stroke', () => {
    it('stroke darker on hover', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const { container } = render(<LineSvg srcCoord={srcCoord} dstCoord={dstCoord} isHovered />)
      const path = container.querySelector('path')
      expect(path).toHaveAttribute('stroke', '#444444')
    })
  })
})
