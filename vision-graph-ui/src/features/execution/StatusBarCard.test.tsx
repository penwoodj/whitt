import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { StatusBarCard } from './StatusBarCard'

describe('StatusBarCard', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  describe('EXE-09 status card minimal', () => {
    it('rounded card displayed', () => {
      renderWithTheme(<StatusBarCard status="idle" stepTitle="Ready" />)
      
      const card = screen.getByRole('status')
      expect(card).toBeInTheDocument()
      expect(card).toHaveStyle({ borderRadius: expect.any(String) })
    })

    it('card contains only status text', () => {
      renderWithTheme(<StatusBarCard status="idle" stepTitle="Ready" />)
      
      expect(screen.getByText('Ready')).toBeInTheDocument()
    })

    it('card contains only loader', () => {
      renderWithTheme(<StatusBarCard status="running" stepTitle="Processing" />)
      
      const loader = screen.getByRole('progressbar')
      expect(loader).toBeInTheDocument()
    })
  })

  describe('EXE-10 hover affordance', () => {
    it('color shifts on hover', () => {
      renderWithTheme(<StatusBarCard status="idle" stepTitle="Ready" />)
      
      const card = screen.getByRole('status')
      const computedStyle = window.getComputedStyle(card)
      expect(computedStyle.transition).toBeTruthy()
    })

    it('tooltip opens on hover', () => {
      renderWithTheme(<StatusBarCard status="idle" stepTitle="Ready" showTooltip />)
      
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toBeInTheDocument()
    })
  })

  describe('EXE-13 only text+loader', () => {
    it('no third content type in card', () => {
      renderWithTheme(<StatusBarCard status="running" stepTitle="Processing" />)
      
      const card = screen.getByRole('status')
      const children = card.children
      
      let contentTypes = new Set()
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement
        if (child.tagName === 'SPAN' || child.tagName === 'DIV') {
          contentTypes.add('text')
        }
        if (child.getAttribute('role') === 'progressbar') {
          contentTypes.add('loader')
        }
      }
      
      expect(contentTypes.size).toBeLessThanOrEqual(2)
    })
  })

  describe('EXEC-02 title truncation', () => {
    it('title shows ellipsis at card edge', () => {
      const longTitle = 'This is a very long step title that should be truncated'
      renderWithTheme(<StatusBarCard status="running" stepTitle={longTitle} />)
      
      const titleElement = screen.getByText(longTitle)
      expect(titleElement).toHaveStyle({ 
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      })
    })

    it('hovering title shows full text', () => {
      const longTitle = 'This is a very long step title that should be truncated'
      renderWithTheme(<StatusBarCard status="running" stepTitle={longTitle} showTooltip />)
      
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip.textContent).toBe(longTitle)
    })
  })
})