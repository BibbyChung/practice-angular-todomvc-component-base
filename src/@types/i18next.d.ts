import en from '../assets/locales/translation.en.json'
const defaultNS = '_'
export const resources = {
  en: {
    [defaultNS]: en,
  },
} as const

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: typeof resources.en
  }
}
