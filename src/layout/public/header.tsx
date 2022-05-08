import React, { useContext } from 'react'
import styled from 'styled-components'
import { LangContext } from '../../app/context/lang'
import { Lang } from '../../app/context/lang/hook'
import { ThemeContext } from '../../app/context/theme'
import { ThemeMode } from '../../app/context/theme/hook'

function Header() {
  const { lang, setLang } = useContext(LangContext)
  const { mode, setMode } = useContext(ThemeContext)

  return (
    <Container>
      {lang !== Lang.EN && <button onClick={() => setLang(Lang.EN)}>{Lang.EN}</button>}
      {lang !== Lang.FR && <button onClick={() => setLang(Lang.FR)}>{Lang.FR}</button>}
      {mode !== ThemeMode.LIGHT && <button onClick={() => setMode(ThemeMode.LIGHT)}>{ThemeMode.LIGHT}</button>}
      {mode !== ThemeMode.DARK && <button onClick={() => setMode(ThemeMode.DARK)}>{ThemeMode.DARK}</button>}
    </Container>
  )
}

export default Header

const Container = styled.header`
  align-items: center;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  padding: 16px 8px;
  width: 100%;

  & > button {
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.secondary.main};;
    margin: 0 8px;
    padding: 16px;
  }
`