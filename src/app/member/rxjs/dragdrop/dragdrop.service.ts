import { fromEvent, tap, merge, map, switchMap, takeUntil } from 'rxjs'
import { windowType } from '../../../lib/services/layout.service'

type MTEvent = MouseEvent | TouchEvent

type CoordinationType = {
  event: MTEvent
  posX: number
  posY: number
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export const getDragdropInfo = (
  dragdropElem: HTMLElement,
  boundaryElem: HTMLElement,
  w: windowType
) => {
  const clientX = (event: MTEvent): number => {
    if (event.type === 'mousemove' || event.type === 'mousedown') {
      return (event as MouseEvent).clientX
    }
    return (event as TouchEvent).changedTouches[0].clientX
  }
  const clientY = (event: MTEvent): number => {
    if (event.type === 'mousemove' || event.type === 'mousedown') {
      return (event as MouseEvent).clientY
    }
    return (event as TouchEvent).changedTouches[0].clientY
  }

  const minX = (): number => 0 //enabledScopeElem.offsetLeft
  const minY = (): number => 0 //enabledScopeElem.offsetTop

  const maxX = (): number => minX() + boundaryElem.offsetWidth - dragdropElem.offsetWidth
  const maxY = (): number => minY() + boundaryElem.offsetHeight - dragdropElem.offsetHeight

  const posX = (event: MTEvent): number => clientX(event) - dragdropElem.offsetLeft
  const posY = (event: MTEvent): number => clientY(event) - dragdropElem.offsetTop

  const calcX = (move: MTEvent, down: CoordinationType): number =>
    Math.max(down.minX ?? 0, Math.min(clientX(move) - down.posX, down.maxX))
  const calcY = (move: MTEvent, down: CoordinationType): number =>
    Math.max(down.minY ?? 0, Math.min(clientY(move) - down.posY, down.maxY))

  const mdown$ = fromEvent<MouseEvent>(dragdropElem, 'mousedown').pipe(
    tap((e) => e.preventDefault())
  )
  const mmove$ = fromEvent<MouseEvent>(w.document, 'mousemove')
  const mup$ = fromEvent<MouseEvent>(w.document, 'mouseup')

  const tdown$ = fromEvent<TouchEvent>(dragdropElem, 'touchstart').pipe(
    tap((e) => e.preventDefault())
  )
  const tmove$ = fromEvent<TouchEvent>(w.document, 'touchmove')
  const tup$ = merge(
    fromEvent<TouchEvent>(w.document, 'touchend'),
    fromEvent<TouchEvent>(w.document, 'touchcancel')
  )

  const down$ = merge(mdown$, tdown$)
  const move$ = merge(mmove$, tmove$)
  const up$ = merge(mup$, tup$)

  const dragdrop$ = down$.pipe(
    map((down) => {
      return {
        event: down,
        minX: minX(),
        minY: minY(),
        maxX: maxX(),
        maxY: maxY(),
        posX: posX(down),
        posY: posY(down),
      } as CoordinationType
    }),
    switchMap((coordination) => {
      return move$.pipe(
        map((move) => {
          return {
            ...coordination,
            posX: calcX(move, coordination),
            posY: calcY(move, coordination),
          }
        }),
        takeUntil(up$)
      )
    })
  )

  return dragdrop$

  //elem.style.left = `${ddInfo.posX}px`
  //elem.style.top = `${ddInfo.posY}px`
}
