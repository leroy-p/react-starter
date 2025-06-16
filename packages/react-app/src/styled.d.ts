import 'styled-components'
import { ITheme } from './app/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends ITheme {}
}
