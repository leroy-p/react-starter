import { createContext } from "react"
import { ILangContextData } from "./hook"

export enum Lang {
  EN = 'en',
  FR = 'fr',
}

export const defaultLang = Lang.EN

export const langContextDefaultValue = { lang: defaultLang, setLang: () => defaultLang }

export const LangContext = createContext<ILangContextData>(langContextDefaultValue)