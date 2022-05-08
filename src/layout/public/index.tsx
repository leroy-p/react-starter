import React from 'react'
import styled from 'styled-components'

import Header from './header'
import Main from './main'
import Footer from './footer'

interface IProps {
  children: JSX.Element
}

function Layout(props: IProps) {
  const { children } = props

  return (
    <Wrapper>
      <Header />
      <Main {...props}>{children}</Main>
      <Footer />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.palette.primary.main};
  min-height: 100vh;
  overflow-x: hidden;
  width: 100vw;
`

export default Layout
