import { defineConfig } from 'i18next-cli'

export default defineConfig({
  locales: ['en', 'fr'],
  extract: {
    input: ['src/**/*.{ts,tsx}'],
    output: 'src/locales/{{language}}/{{namespace}}.json',
    sort: true,
    defaultNS: 'translation',
    defaultValue: (key) => `::${key}`,
  },
})
