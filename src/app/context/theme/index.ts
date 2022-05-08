import { createContext } from "react"
import { defaultTheme, IThemeContextData, ThemeMode } from "./hook"

export const defaultMode = ThemeMode.LIGHT

export const ThemeContextDefaultValue = { mode: defaultMode, theme: defaultTheme, setMode: () => {} }

export const ThemeContext = createContext<IThemeContextData>(ThemeContextDefaultValue)