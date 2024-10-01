import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import EN from '../../../assets/locales/translation.en.json'
import JA from '../../../assets/locales/translation.ja.json'

export const lngMapping = [
  { name: 'en', json: EN },
  { name: 'ja', json: JA },
]

export const setupI18n = () => {
  const defaultLng = 'ja'
  const defaultNS = '_'
  i18next.use(LanguageDetector).init({
    detection: {
      order: [
        'querystring', // ?lng=en // for test
        // 'cookie',
        'localStorage',
        // 'sessionStorage',
        'navigator',
        // 'htmlTag',
        // 'path',
        // 'subdomain',
      ],
      lookupLocalStorage: 'i18nLng',
      caches: ['localStorage'],
    },
    fallbackLng: defaultLng,
    defaultNS,
    resources: lngMapping.reduce((pre, cur) => {
      return { ...pre, ...{ [cur.name]: { [defaultNS]: cur.json } } }
    }, {}),
  })

  // for test
  // const ld = new LanguageDetector(i18next.services, {
  //   order: [
  //     'querystring', // ?lng=en
  //     // 'cookie',
  //     'localStorage',
  //     // 'sessionStorage',
  //     'navigator',
  //     // 'htmlTag',
  //     // 'path',
  //     // 'subdomain',
  //   ],
  // })

  // console.log(ld.detect())

  // ## remote loading
  // const i18nJson = ['/assets/locales/translation.en.json', '/assets/locales/translation.ja.json']
  // return Promise.all(i18nJson.map((path) => fetch(path).then((a) => a.json()))).then(([EN, JA]) => {
  //   i18next.init({
  //     lng: language,
  //     defaultNS,
  //     resources: {
  //       en: {
  //         [defaultNS]: EN,
  //       },
  //       ja: {
  //         [defaultNS]: JA,
  //       },
  //     },
  //   })
  // })
}

export const getCurrentLng = () => i18next.language

export const i18nT = i18next.t
