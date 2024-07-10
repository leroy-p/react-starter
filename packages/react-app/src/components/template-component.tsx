import React from 'react'
import styled from 'styled-components'

interface IProps {}

export default function TemplateComponent(props: IProps) {
  return <Container></Container>
}

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`
