import { useTranslation } from 'react-i18next'

export function useI18n() {
  const translation = useTranslation()

  function t(key: string, options?: { [key: string]: string | number }) {
    const result = translation.t(key, options)

    return result.includes('::') ? translation.t(key, { ...options, lng: 'en' }) : result
  }

  return { ...translation, t }
}
