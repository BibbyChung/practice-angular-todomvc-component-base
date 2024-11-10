import { Renderer2, Type } from '@angular/core'
import { Meta, MetaDefinition, Title } from '@angular/platform-browser'
import { NavigationExtras, Router } from '@angular/router'
import { combineLatest, delay, filter, from, map, of, switchMap, take, tap } from 'rxjs'
import { getBehaviorSubject } from '../common/utils'

const isClient$ = getBehaviorSubject(true)
export const setIsClient = (isClient: boolean) => isClient$.next(isClient)
export const getIsClient = () => isClient$.asObservable()

const render$ = getBehaviorSubject<Renderer2 | null>(null)
export const setRender = (render: Renderer2) => render$.next(render)
export const getRender = () =>
  render$.pipe(
    filter((r) => !!r),
    map((r) => r as Renderer2)
  )

export type windowType = Window & typeof globalThis
const window$ = getBehaviorSubject<windowType | null>(null)
export const setWindow = (w: windowType | null) => window$.next(w)
export const getWindow = () =>
  getIsClient().pipe(
    filter((isClient) => isClient),
    switchMap(() => window$),
    filter((w) => !!w),
    map((w) => w as windowType)
  )

// router
const router$ = getBehaviorSubject<Router | null>(null)
export const setRouter = (router: Router) => router$.next(router)
export const navigate = (paths: string[], options?: NavigationExtras, delayS = 300) =>
  router$.pipe(
    filter((a) => !!a),
    map((r) => r as Router),
    delay(delayS),
    tap((r) => r.navigate(paths, options)),
    take(1)
  )
export const navigateByNative = (path: string) =>
  getWindow().pipe(
    tap((w) => {
      w.document.location.href = path
    })
  )

// modal
export type ModalPropsType = Record<string | 'width' | 'btnSubmit$', unknown>
export type ModalType<T extends ModalPropsType> = {
  component: Type<unknown>
  props?: T
}
const modals$ = getBehaviorSubject<ModalType<ModalPropsType>[]>([])
export const getModals = () => modals$.asObservable()

export const showModal = <T extends ModalType<ModalPropsType>>(obj: T) => {
  const arr = [...modals$.getValue(), obj]
  modals$.next(arr)
}
export const closeModal = () => {
  const arr = modals$.getValue()
  arr.pop()
  modals$.next(arr)
}

// notify
export type NotifierType = 'info' | 'success' | 'warning' | 'danger'
export const notify = (type: NotifierType = 'info', text: string, title = '', timeout = 4000) => {
  const tt = title === '' ? type.toString().toUpperCase() : title

  return of(true).pipe(
    switchMap(() => from(import('notifier-js'))),
    tap((o) => o.default.show(tt, text, type, '', timeout))
  )
}

// tdk
export type TDKType = {
  title: string
  description?: string
  keywords?: string[]
}
const title$ = getBehaviorSubject<Title | null>(null)
export const setTitleSer = (title: Title) => title$.next(title)
const meta$ = getBehaviorSubject<Meta | null>(null)
export const setMetaSer = (meta: Meta) => meta$.next(meta)
export const setMeta = (tags: MetaDefinition[]) =>
  meta$.pipe(
    filter((a) => !!a),
    map((a) => a!.addTags(tags))
  )
export const setTDK = (info: TDKType) =>
  combineLatest([title$.pipe(filter((t) => !!t)), meta$.pipe(filter((m) => !!m))]).pipe(
    tap(([t, m]) => {
      t!.setTitle(info.title)
      if (info.description) {
        m!.updateTag({
          name: 'description',
          content: info.description,
        })
      }
      if (info.keywords) {
        m!.updateTag({
          name: 'keywords',
          content: info.keywords.join(', '),
        })
      }
    })
  )

// others
export const preventBodyScroll = (isOpen: boolean) =>
  combineLatest([getWindow(), getRender()]).pipe(
    tap(([w, r]) => {
      const body = w.document.body
      if (isOpen) {
        r.addClass(body, 'overflow-hidden')
        // body.classList.add('overflow-hidden');
      } else {
        r.removeClass(body, 'overflow-hidden')
        // body.classList.remove('overflow-hidden');
      }
    })
  )
