import styled from 'styled-components'
import logo from '../assets/images/logo512.png'
import { useI18n } from '../hooks/use-i18n'
import Layout from '../layout'

export default function Root() {
  const { t } = useI18n()

  return (
    <Layout>
      <Container>
        <h6>{t('root.title')}</h6>
        <p>{t('root.message')}</p>
        <img alt="" src={logo} />
      </Container>
    </Layout>
  )
}

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  width: 100%;

  & > h6 {
    font-size: 48px;
  }

  & > p {
    font-size: 24px;
  }

  & > img {
    height: 72px;
    width: auto;
  }
`
