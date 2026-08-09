import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import type { Theme } from './theme'
import { darkTheme } from './theme'
import type { ReactNode } from 'react'

type ThemeProviderProps = {
  theme?: Theme
  children: ReactNode
}

export const ThemeProvider = ({ theme = darkTheme, children }: ThemeProviderProps) => (
  <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
)
