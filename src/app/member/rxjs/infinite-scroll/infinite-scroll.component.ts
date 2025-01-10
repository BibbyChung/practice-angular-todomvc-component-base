import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  OnDestroy,
  viewChild,
} from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { filter, map, scan, switchMap, tap } from 'rxjs'
import { getBehaviorSubject } from '../../../lib/common/utils'
import { getFakeData } from './fake-data.service'

@Component({
  selector: 'bb-infinite-scroll',
  imports: [CommonModule],
  template: `
    @if (data$ | async; as data) {
      <div>
        @for (item of data; track $index) {
          <p>{{ item }}({{ $index }})</p>
        }
      </div>
    }
    <div
      [class]="{ hidden: (isLoadingShow$ | async) === false }"
      #loading
      class="flex h-8 items-center justify-center bg-yellow-400"
    >
      <span>loading....</span>
    </div>
  `,
  styles: `
    p {
      @apply h-44 border border-red-300;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteScrollComponent implements OnDestroy {
  injector = inject(Injector)
  loadingS = viewChild.required<ElementRef<HTMLElement>>('loading')
  fetchData$ = getBehaviorSubject(0)
  isLoadingShow$ = getBehaviorSubject(true)

  intersectionObserver$ = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('entry.isIntersecting')
          this.fetchData$.next(this.fetchData$.value + 1)
        }
      })
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    }
  )

  data$ = this.fetchData$.pipe(
    switchMap((index) => getFakeData(index)),
    map((info) => {
      if (info.data.length <= 0) {
        this.isLoadingShow$.next(false)
      }
      return info.data
    }),
    filter((a) => a.length > 0),
    scan((pre, cur) => {
      return [...pre, ...cur]
    }, [] as string[])
  )

  initObserverSub = toObservable(this.loadingS, { injector: this.injector })
    .pipe(
      tap((elemRef) => {
        this.intersectionObserver$.observe(elemRef.nativeElement)
      }),
      takeUntilDestroyed()
    )
    .subscribe()

  ngOnDestroy() {
    this.intersectionObserver$.disconnect()
  }
}
