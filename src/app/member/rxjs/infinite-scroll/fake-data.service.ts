import { delay, of } from 'rxjs'

export const getFakeData = () => {
  const arr = [
    'infinite-scroll works!',
    'infinite-scroll works!',
    'infinite-scroll works!',
    'infinite-scroll works!',
    'infinite-scroll works!',
    'infinite-scroll works!',
  ].map((item) => `${item}`)
  return of(arr).pipe(delay(800))
}
