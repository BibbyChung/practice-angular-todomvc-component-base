import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { RouterModule } from '@angular/router'
import { switchMap } from 'rxjs'
import { getSubject } from '../common/utils'
import { navigate } from '../services/layout.service'

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
        <a [routerLink]="['/member/reactive-form']" routerLinkActive="router-link-active">
          reactive-form
        </a>
      </li>
      <li>
        <a [routerLink]="['/member/dragdrop']" routerLinkActive="router-link-active"> dragdrop </a>
      </li>

      <li class="flex items-center">
        <button (click)="logout$.next(true)" class="btn">logout</button>
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

  logoutSub = this.logout$
    .pipe(
      takeUntilDestroyed(),
      switchMap(() => navigate(['/guest/login']))
    )
    .subscribe()
}
