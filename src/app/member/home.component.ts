import { setTDK } from './../lib/services/layout.service'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { filter, switchMap, tap } from 'rxjs'
import { getEnvSetting, getSubject } from '../lib/common/utils'
import {
  ModalConfirmComponent,
  ModalConfirmType,
} from '../lib/components/modal/modal-confirm.component'
import { ModalType, closeModal, showModal } from '../lib/services/layout.service'

@Component({
  selector: 'bb-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>home works! => id:{{ id() }}, env: {{ envSetting.env }}</p>
    <button class="btn" (click)="confirm$.next(true)">comfirm</button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected confirm$ = getSubject<boolean>()
  protected id = input<number>(0)
  protected envSetting = getEnvSetting()

  tdkSub = setTDK({
    title: 'home title',
    description: 'home description',
    keywords: ['11', '22', '33'],
  })
    .pipe(takeUntilDestroyed())
    .subscribe()

  confirmSub = this.confirm$
    .pipe(
      takeUntilDestroyed(),
      switchMap(() => {
        const ok$ = getSubject<boolean>()
        showModal<ModalType<ModalConfirmType>>({
          component: ModalConfirmComponent,
          props: {
            msg: '這是一個 confirm !',
            ok$,
          },
        })
        return ok$
      }),
      filter((a) => a),
      tap(() => closeModal())
    )
    .subscribe()
}
