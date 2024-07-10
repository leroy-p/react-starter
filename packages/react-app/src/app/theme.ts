export interface ITheme {
  palette: {
    primary: {
      main: string
    }
    secondary: {
      main: string
    }
    error: {
      main: string
    }
  }
}

export const theme: ITheme = {
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#000000',
    },
    error: {
      main: '#ff0000',
    },
  },
}
