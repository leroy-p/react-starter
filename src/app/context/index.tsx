import React from 'react'

import { defaultLang, LangContext } from './lang'
import { useLangContext } from './lang/hook'

interface IProps {
  children: JSX.Element
}

function ContextProvider({ children }: IProps) {
  const langContextValue = useLangContext(defaultLang)

  return  (
    <LangContext.Provider value={langContextValue}>
      {children}
    </LangContext.Provider>
  )
}

export default ContextProvider