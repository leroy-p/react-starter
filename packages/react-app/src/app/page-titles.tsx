import React from 'react'
import { useI18n } from '../hooks/use-i18n'

export default function PageTitles() {
  const { t } = useI18n()

  return (
    <>
      {t('root.page-title')}
      {t('not-found.page-title')}
    </>
  )
}
