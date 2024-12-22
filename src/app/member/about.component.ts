import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { switchMap } from 'rxjs'
import { getSubject } from '../lib/common/utils'
import { notify, setTDK } from '../lib/services/layout.service'

@Component({
    selector: 'bb-about',
    imports: [CommonModule],
    template: `
    <p>abount works!</p>
    <button class="btn" (click)="showSuccess$.next(true)">notify success</button>
  `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  protected showSuccess$ = getSubject<boolean>()

  tdkSub = setTDK({
    title: 'about title',
    description: 'about description',
    keywords: ['55', '66', '77'],
  })
    .pipe(takeUntilDestroyed())
    .subscribe()

  showSuccessSub = this.showSuccess$
    .pipe(
      takeUntilDestroyed(),
      switchMap(() => notify('success', '成功啦啦啦啦啦'))
    )
    .subscribe()
}
