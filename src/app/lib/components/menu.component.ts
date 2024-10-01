import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { RouterModule } from '@angular/router'
import { map, switchMap, tap } from 'rxjs'
import { setLSItem } from '../common/storage'
import { getSubject } from '../common/utils'
import { navigate, navigateByNative } from '../services/layout.service'
import { getCurrentLng, lngMapping } from './../services/i18n.service'

@Component({
  selector: 'bb-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <ul class="flex text-blue-400">
      <li>
        <a [routerLink]="['/member/home']" routerLinkActive="router-link-active"> home </a>
      </li>
      <li>
        <a [routerLink]="['/member/about']" routerLinkActive="router-link-active"> about </a>
      </li>
      <li>
        <a [routerLink]="['/member/hello-world']" routerLinkActive="router-link-active">
          hello-world
        </a>
      </li>
      <li>
        <a [routerLink]="['/member/todomvc']" routerLinkActive="router-link-active"> todomvc </a>
      </li>
      <li>
        <a [routerLink]="['/member/dynamic-cmp']" routerLinkActive="router-link-active">
          dynamic-cmp
        </a>
      </li>
      <li>
        <a [routerLink]="['/member/ng-template']" routerLinkActive="router-link-active">
          ng-template
        </a>
      </li>
      <li>
        <a [routerLink]="['/member/i18n']" routerLinkActive="router-link-active"> i18n </a>
      </li>
      <li class="flex items-center">
        <button (click)="logout$.next(true)" class="btn">logout</button>
      </li>
      <li class="flex items-center">
        <select #selectLngRef class="select ml-2" (change)="this.selectChange$.next($event)">
          @for (item of lngMapping; track $index) {
            <option [value]="item.name">{{ item.name }}</option>
          }
        </select>
      </li>
    </ul>
  `,
  styles: `
    .router-link-active {
      @apply text-red-400;
    }
    li a {
      @apply relative block px-4 py-2;
    }
    li + li a {
      &:before {
        @apply absolute left-[-1px] text-black;
        @apply content-["|"];
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  protected logout$ = getSubject<boolean>()

  protected selectLngRefS = viewChild.required<ElementRef<HTMLSelectElement>>('selectLngRef')
  protected selectChange$ = getSubject<Event>()

  protected lngMapping = lngMapping

  logoutSub = this.logout$
    .pipe(
      takeUntilDestroyed(),
      switchMap(() => navigate(['/guest/login']))
    )
    .subscribe()

  selectLngRefSub = this.selectChange$
    .pipe(
      takeUntilDestroyed(),
      tap((e) => {
        const elem = e.target as HTMLSelectElement
        setLSItem('i18nLng', elem.value)
      }),
      switchMap(() => navigateByNative('/member/i18n'))
    )
    .subscribe()

  isReadySub = toObservable(this.selectLngRefS)
    .pipe(
      takeUntilDestroyed(),
      map((elemRef) => {
        const lng = getCurrentLng()
        elemRef.nativeElement.value = lng.split('-')[0] ?? this.lngMapping[0].name
      })
    )
    .subscribe()
}
