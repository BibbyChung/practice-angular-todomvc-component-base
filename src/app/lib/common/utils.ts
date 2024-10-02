import { BehaviorSubject, Observable, Subject, Subscriber, TeardownLogic } from 'rxjs'
import { environment } from '../../../environments/environment'

export const getEnvSetting = () => environment

export const getSubject = <T>() => new Subject<T>()
export const getBehaviorSubject = <T>(v: T) => new BehaviorSubject(v)
export const getObservable = <T>(
  func: (this: Observable<T>, subscriber: Subscriber<T>) => TeardownLogic
) => new Observable(func)

export const getUUIDEmpty = () => {
  return '00000000-0000-0000-0000-000000000000'
}

export const getUUID = () => {
  // return uuidv1();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const getShortUUIDEmpty = () => {
  return getUUIDEmpty().split('-')[0]
}

export const getShortUUID = () => {
  return `a${getUUID().split('-')[0]}`
}

export const cleanObj = (obj: object) =>
  Object.entries(obj).reduce(
    (pre, cur) => {
      const [key, value] = cur
      if (value === undefined || value === null) {
        return pre
      }
      if (Array.isArray(value) && value.length !== 0) {
        pre[key] = value
      }
      if (!Array.isArray(value)) {
        pre[key] = value
      }
      return pre
    },
    {} as Record<string, unknown>
  )

export const sleep = (waitingMillisecond: number) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, waitingMillisecond)
  })

export const retryFunc = async (
  times: number,
  waitingMillisecond: number,
  fun: () => boolean | Promise<boolean>
) => {
  if (times <= 0) {
    return
  }
  const bo = await fun()
  if (bo) {
    return
  }
  await sleep(waitingMillisecond)
  const t = times - 1
  await retryFunc(t, waitingMillisecond, fun)
}
