import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import GraphTitle from './GraphTitle'
import type { GraphTitleProps } from './topBarTypes'

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('GraphTitle', () => {
  it('renders title text', () => {
    const props: GraphTitleProps = {
      title: 'Test Graph',
    }

    renderWithTheme(<GraphTitle {...props} />)

    expect(screen.getByText('Test Graph')).toBeInTheDocument()
  })

  it('truncates long titles', () => {
    const longTitle = 'A'.repeat(100)
    const props: GraphTitleProps = {
      title: longTitle,
    }

    const { container } = renderWithTheme(<GraphTitle {...props} />)

    const title = container.querySelector('h1')
    expect(title).toHaveStyle({ textOverflow: 'ellipsis' })
  })
})
