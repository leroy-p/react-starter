import React from 'react'

import { useI18n } from '../../hooks/use-i18n'

export default function Loading() {
  const { t } = useI18n()

  return <p>{t('loading.title')}</p>
}
