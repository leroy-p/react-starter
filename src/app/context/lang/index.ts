import { createContext } from "react"
import { ILangContextData, Lang } from "./hook"

export const defaultLang = Lang.EN

export const langContextDefaultValue = { lang: defaultLang, setLang: () => defaultLang }

export const LangContext = createContext<ILangContextData>(langContextDefaultValue)