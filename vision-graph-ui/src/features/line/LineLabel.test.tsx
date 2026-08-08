import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { log } from '../../shared/logger'
import LineLabel from './LineLabel'

const lineLog = log('LineLabel')

describe('LineLabel', () => {
  describe('Label shows kind', () => {
    it('label visible at midpoint', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const lineKind = 'PRODUCED' as const
      render(<LineLabel srcCoord={srcCoord} dstCoord={dstCoord} lineKind={lineKind} />)
      const label = screen.getByText('PRODUCED')
      expect(label).toBeVisible()
    })

    it('label txt = "PRODUCED"', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const lineKind = 'PRODUCED' as const
      render(<LineLabel srcCoord={srcCoord} dstCoord={dstCoord} lineKind={lineKind} />)
      const label = screen.getByText('PRODUCED')
      expect(label.textContent).toBe('PRODUCED')
    })
  })

  describe('Click label fires callback', () => {
    it('onLabelClick called w/ "DEPENDS_ON"', () => {
      const onLabelClick = vi.fn()
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const lineKind = 'DEPENDS_ON' as const
      render(<LineLabel srcCoord={srcCoord} dstCoord={dstCoord} lineKind={lineKind} onLabelClick={onLabelClick} />)
      const label = screen.getByText('DEPENDS_ON')
      label.click()
      expect(onLabelClick).toHaveBeenCalledWith('DEPENDS_ON')
    })
  })

  describe('Long kind handling', () => {
    it('renders long kind text', () => {
      const srcCoord = { x: 0, y: 0 }
      const dstCoord = { x: 100, y: 100 }
      const lineKind = 'ENQUEUED_BY' as const
      render(<LineLabel srcCoord={srcCoord} dstCoord={dstCoord} lineKind={lineKind} />)
      const label = screen.getByText('ENQUEUED_BY')
      expect(label).toBeVisible()
    })
  })
})
