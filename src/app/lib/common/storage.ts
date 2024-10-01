export const sgKey = 'i18nLng'

export const setLSItem = (key: string, v: object | string) => {
  if (!v) {
    throw new Error('the "v" is empty')
  }
  const ss = typeof v === 'object' ? JSON.stringify(v) : v
  localStorage.setItem(key, ss)
}

export const getLSItem = <T>(key: string) => {
  const str = localStorage.getItem(key)
  if (!str) {
    return null
  }
  try {
    return JSON.parse(str) as T
  } catch (err) {
    return str as T
  }
}

export const delLSItem = (key: string) => {
  localStorage.removeItem(key)
}
