import React from 'react'

import { defaultLang, LangContext } from './lang'
import { useLangContext } from './lang/hook'
import { defaultMode, ThemeContext } from './theme'
import { useThemeContext } from './theme/hook'

interface IProps {
  children: JSX.Element
}

function ContextProvider({ children }: IProps) {
  const langContextValue = useLangContext(defaultLang)
  const themeContextValue = useThemeContext(defaultMode)

  return  (
    <LangContext.Provider value={langContextValue}>
      <ThemeContext.Provider value={themeContextValue}>
        {children}
      </ThemeContext.Provider>
    </LangContext.Provider>
  )
}

export default ContextProvider