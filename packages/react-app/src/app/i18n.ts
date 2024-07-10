import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import detector from 'i18next-browser-languagedetector'

import translationsEn from '../locales/en/translation.json'
import translationsFr from '../locales/fr/translation.json'

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationsEn,
      },
      fr: {
        translation: translationsFr,
      },
    },
    fallbackLng: 'en',
    saveMissing: true,
    debug: true,
    fallbackNS: 'en',
  })

export default i18n
