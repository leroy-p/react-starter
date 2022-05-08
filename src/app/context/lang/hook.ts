import { useState } from 'react'

export enum Lang {
  EN = 'en',
  FR = 'fr',
}

export interface ILangContextData {
  lang: Lang
  setLang: (value: Lang) => void
}

export function useLangContext(defaultLang: Lang): ILangContextData {
  const [lang, setLang] = useState<Lang>(defaultLang)

  return { lang, setLang }
}