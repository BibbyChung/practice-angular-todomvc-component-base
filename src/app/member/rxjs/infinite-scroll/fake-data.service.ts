import { delay, of } from 'rxjs'

export const getFakeData = (index: number) => {
  let data = [
    'infinite-scroll works!',
    'infinite-scroll works!',
    'infinite-scroll works!',
    'infinite-scroll works!',
    'infinite-scroll works!',
    'infinite-scroll works!',
  ]

  if (index > 3) {
    data = []
  }

  const obj = {
    data: data.map((item) => `${item}`),
    currentIndex: index,
  }

  return of(obj).pipe(delay(800))
}
