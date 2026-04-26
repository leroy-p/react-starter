import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import i18n from '../app/i18n'

beforeEach(async () => {
  window.history.replaceState({}, '', '/')
  await i18n.changeLanguage('en')
})

afterEach(() => {
  cleanup()
})
