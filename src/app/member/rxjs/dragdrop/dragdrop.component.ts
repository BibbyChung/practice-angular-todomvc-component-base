import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { combineLatest, map, switchMap, tap } from 'rxjs'
import { getWindow } from '../../../lib/services/layout.service'
import { getDragdropInfo } from './dragdrop.service'

@Component({
  selector: 'bb-drapdrop',
  standalone: true,
  imports: [],
  template: `
    <div #boundaryRef class="relative  w-[800px] h-[400px] bg-yellow-300">
      <p #ballRef class="absolute h-12 w-12 rounded-full bg-green-600"></p>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragdropComponent {
  boundaryRefS = viewChild.required<ElementRef<HTMLElement>>('boundaryRef')
  ballRefS = viewChild.required<ElementRef<HTMLElement>>('ballRef')

  dragdropSub = combineLatest([
    toObservable(this.ballRefS),
    toObservable(this.boundaryRefS),
    getWindow(),
  ])
    .pipe(
      switchMap(([ballRef, ddScropRef, w]) =>
        getDragdropInfo(ballRef.nativeElement, ddScropRef.nativeElement, w).pipe(
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
