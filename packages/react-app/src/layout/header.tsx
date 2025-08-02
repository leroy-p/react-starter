import styled from 'styled-components'
import { APP_NAME } from '../app/page'

export default function Header() {
  return (
    <Container>
      <p>{APP_NAME}</p>
    </Container>
  )
}

const Container = styled.header`
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 48px;
  justify-content: space-between;
  padding: 0 24px;
  width: 100%;

  & > p {
    font-size: 24px;
  }
`
