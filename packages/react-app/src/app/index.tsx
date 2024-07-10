import React from 'react'
import { ThemeProvider } from 'styled-components'

import { theme } from './theme'
import GlobalStyle from './global-style'
import Router from './router'
import './i18n'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle theme={theme} />
      <Router />
    </ThemeProvider>
  )
}
