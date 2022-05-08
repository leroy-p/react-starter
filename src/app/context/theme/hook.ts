import { useState } from 'react'

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface ITheme {
  palette: {
    primary: {
      main: string
    },
    secondary: {
      main: string
    },
    text: {
      main: string
    },
    error: {
      main: string
    },  
  }
}

export interface IThemeContextData {
  mode: ThemeMode
  theme: ITheme
  setMode: (value: ThemeMode) => void
}

export const defaultTheme: ITheme = {
  palette: {
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#000000",
    },
    text: {
      main: "#000000",
    },
    error: {
      main: "#ff0000",
    },  
  }
}
const lightTheme: ITheme = {
  ...defaultTheme,
}
const darkTheme: ITheme = {
  ...defaultTheme,
  palette: {
    ...defaultTheme.palette,
    primary: {
      main: "#000000",
    },  
    secondary: {
      main: "#ffffff",
    },  
    text: {
      main: "#ffffff",
    },  
  }
}

const themes = {
  [ThemeMode.LIGHT]: lightTheme,
  [ThemeMode.DARK]: darkTheme,
}

export function useThemeContext(defaultMode: ThemeMode): IThemeContextData {
  const [currentMode, setCurrentMode] = useState<ThemeMode>(defaultMode)
  const [theme, setTheme] = useState<ITheme>(themes[defaultMode] || lightTheme)

  function setMode(mode: ThemeMode) {
    setCurrentMode(themes[mode] ? mode : currentMode)
    setTheme(themes[mode] || theme)
  }

  return { theme, mode: currentMode, setMode }
}