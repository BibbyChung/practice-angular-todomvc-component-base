import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { switchMap } from 'rxjs'
import { getSubject } from '../lib/common/utils'
import { navigate } from '../lib/services/layout.service'

@Component({
  selector: 'bb-login',
  standalone: true,
  imports: [CommonModule],
  template: ` <button class="btn" (click)="login$.next(true)">login</button> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  protected login$ = getSubject<boolean>()

  loginSub = this.login$
    .pipe(
      takeUntilDestroyed(),
      switchMap(() => navigate(['/member/home']))
    )
    .subscribe()
}
