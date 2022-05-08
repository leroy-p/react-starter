import React, { useContext, useEffect } from 'react'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { ThemeProvider } from 'styled-components'
import { en, fr } from 'make-plural/plurals'

import { catalogs } from '../locale/catalogs'
import { LangContext } from './context/lang'
import { ThemeContext } from './context/theme'
import GlobalStyle from './global-style'
import Router from './router'

i18n.load(catalogs)
i18n.loadLocaleData('fr', { plurals: fr })
i18n.loadLocaleData('en', { plurals: en })

function App() {
  const { lang } = useContext(LangContext)
  const { theme } = useContext(ThemeContext)

  useEffect(() => {
    i18n.activate(lang)
  }, [lang])

  return (
    <I18nProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router />
      </ThemeProvider>
    </I18nProvider>
  )
}

export default App

