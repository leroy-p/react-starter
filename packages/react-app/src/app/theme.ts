export interface ITheme {
  palette: {
    primary: string
    secondary: string
    error: string
  }
}

export const theme: ITheme = {
  palette: {
    primary: '#ffffff',
    secondary: '#000000',
    error: '#ff0000',
  },
}
