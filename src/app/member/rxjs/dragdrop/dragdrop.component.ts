import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { combineLatest, fromEvent, map, merge, switchMap, takeUntil, tap } from 'rxjs'
import { getWindow, windowType } from '../../../lib/services/layout.service'

@Component({
  selector: 'bb-drapdrop',
  standalone: true,
  imports: [],
  template: `
    <div #ddScropRef class="h-[600px] w-[1000px] bg-yellow-300">
      <p #ballRef class="absolute h-12 w-12 rounded-full bg-green-400"></p>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragdropComponent {
  ddScropRefS = viewChild.required<ElementRef<HTMLInputElement>>('ddScropRef')
  ballRefS = viewChild.required<ElementRef<HTMLInputElement>>('ballRef')

  dragdropSub = combineLatest([
    toObservable(this.ballRefS),
    toObservable(this.ddScropRefS),
    getWindow(),
  ])
    .pipe(
      switchMap(([ballRef, ddScropRef, w]) =>
        getDragdropInfoOb(ballRef.nativeElement, ddScropRef.nativeElement, w).pipe(
          map((info) => ({
            ddScropRef,
            ballRef,
            ddInfo: info,
          }))
        )
      ),
      tap((info) => {
        info.ballRef.nativeElement.style.left = `${info.ddInfo.posX}px`
        info.ballRef.nativeElement.style.top = `${info.ddInfo.posY}px`
      }),
      takeUntilDestroyed()
    )
    .subscribe()
}

interface ICoords {
  event: MouseEvent
  posX?: number
  posY?: number
  minX?: number
  minY?: number
  maxX?: number
  maxY?: number
  calcX?: number
  calcY?: number
}

// type m = MouseEvent
// type t = TouchEvent

// const eMin = document.getElementById("min");
// const eMax = document.getElementById("max");
// const ePar = document.getElementById('box')
// const elem = document.getElementById('dr')

const getDragdropInfoOb = (
  drapdropElem: HTMLElement,
  enabledScopeElem: HTMLElement,
  w: windowType
) => {
  const clientX = (event: MouseEvent | TouchEvent): number => {
    if (event.type === 'mousemove' || event.type === 'mousedown') {
      return (event as MouseEvent).clientX
    }
    return (event as TouchEvent).changedTouches[0].clientX
  }
  const clientY = (event: MouseEvent | TouchEvent): number => {
    if (event.type === 'mousemove' || event.type === 'mousedown') {
      return (event as MouseEvent).clientY
    }
    return (event as TouchEvent).changedTouches[0].clientY
  }

  const posX = (event: MouseEvent | TouchEvent): number => clientX(event) - drapdropElem.offsetLeft
  const posY = (event: MouseEvent | TouchEvent): number => clientY(event) - drapdropElem.offsetTop

  const minX = (): number => enabledScopeElem.offsetLeft
  const minY = (): number => enabledScopeElem.offsetTop

  const maxX = (event: MouseEvent | TouchEvent): number =>
    minX() + enabledScopeElem.offsetWidth - drapdropElem.offsetWidth
  const maxY = (event: MouseEvent | TouchEvent): number =>
    minY() + enabledScopeElem.offsetHeight - drapdropElem.offsetHeight

  const calcX = (move: MouseEvent | TouchEvent, down: ICoords): number =>
    Math.max(down.minX ?? 0, Math.min(clientX(move) - (down.posX ?? 0), down.maxX ?? 0))
  const calcY = (move: MouseEvent | TouchEvent, down: ICoords): number =>
    Math.max(down.minY ?? 0, Math.min(clientY(move) - (down.posY ?? 0), down.maxY ?? 0))

  const mdown$ = fromEvent<MouseEvent>(drapdropElem, 'mousedown')
  const mmove$ = fromEvent<MouseEvent>(w.document, 'mousemove')
  const mup$ = fromEvent<MouseEvent>(w.document, 'mouseup')

  const tdown$ = fromEvent<TouchEvent>(drapdropElem, 'touchstart').pipe(
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

  const drag$ = down$.pipe(
    map((down) => {
      return {
        event: down,
        minX: minX(),
        minY: minY(),
        maxX: maxX(down),
        maxY: maxY(down),
        posX: posX(down),
        posY: posY(down),
      }
    }),
    switchMap((down) => {
      return move$.pipe(
        map((move) => {
          return {
            ...down,
            posX: calcX(move, down as ICoords),
            posY: calcY(move, down as ICoords),
          }
        }),
        takeUntil(up$)
      )
    })
  )

  return drag$

  // const sub2 = drag$.subscribe((event) => {
  //   drapdropElem.style.left = `${event.posX}px`
  //   drapdropElem.style.top = `${event.posY}px`
  //   // eMin.style.left = `${event.minX}px`;
  //   // eMin.style.top = `${event.minY}px`;
  //   // eMax.style.left = `${event.maxX}px`;
  //   // eMax.style.top = `${event.maxY}px`;
  // })
}
