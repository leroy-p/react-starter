import { useState } from 'react'
import { Lang } from '.'

export interface ILangContextData {
  lang: Lang
  setLang: (value: Lang) => void
}

export function useLangContext(defaultLang: Lang): ILangContextData {
  const [lang, setLang] = useState<Lang>(defaultLang)

  return { lang, setLang }
}