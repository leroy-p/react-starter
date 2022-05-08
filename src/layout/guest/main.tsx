import React from 'react'
import styled from 'styled-components'

interface IProps {
  children: JSX.Element
}

function Main({ children }: IProps) {
  return <Container>{children}</Container>
}

export default Main

const Container = styled.main`
  width: 100%;
`