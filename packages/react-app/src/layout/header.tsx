import React from 'react'
import styled from 'styled-components'

import { useI18n } from '../hooks/use-i18n'
import { APP_NAME } from '../app/page'

export default function Header() {
  const { i18n } = useI18n()

  return (
    <Container>
      <p>{APP_NAME}</p>
      <LanguageContainer>
        <LanguageButton onClick={() => i18n.changeLanguage('en')} selected={i18n.language === 'en'}>
          en
        </LanguageButton>
        <LanguageButton onClick={() => i18n.changeLanguage('fr')} selected={i18n.language === 'fr'}>
          fr
        </LanguageButton>
      </LanguageContainer>
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

const LanguageContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: center;
`

const LanguageButton = styled.button<{ selected: boolean }>`
  font-size: 20px;
  text-transform: uppercase;
  text-decoration: ${({ selected }) => (selected ? 'underline' : 'none')};
`
