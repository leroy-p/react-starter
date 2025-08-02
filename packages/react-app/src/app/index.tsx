import { ThemeProvider } from 'styled-components'
import GlobalStyle from './global-style'
import Router from './router'
import { theme } from './theme'
import './i18n'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle theme={theme} />
      <Router />
    </ThemeProvider>
  )
}
