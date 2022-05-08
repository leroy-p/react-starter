import React, { useContext } from 'react'
import styled from 'styled-components'
import { Lang, LangContext } from '../../app/context/lang'

function Header() {
  const { lang, setLang } = useContext(LangContext)

  return (
    <Container>
      {lang !== Lang.EN && <button onClick={() => setLang(Lang.EN)}>{Lang.EN}</button>}
      {lang !== Lang.FR && <button onClick={() => setLang(Lang.FR)}>{Lang.FR}</button>}
    </Container>
  )
}

export default Header

const Container = styled.header`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  padding: 16px 8px;
  width: 100%;

  & > button {
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: #ffffff;
    margin: 0 8px;
    padding: 16px;
  }
`