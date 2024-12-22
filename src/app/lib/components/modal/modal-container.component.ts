import { CommonModule, NgComponentOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { delay, tap } from 'rxjs'
import { getBehaviorSubject, getSubject } from '../../common/utils'
import { closeModal, getModals } from '../../services/layout.service'

@Component({
    selector: 'bb-modal-container',
    imports: [CommonModule, NgComponentOutlet],
    template: `
    @for (item of modals$ | async; track $index) {
      <div class="fixed inset-0 z-20 h-screen w-screen overflow-y-auto">
        <!-- eslint-disable-next-line @angular-eslint/template/elements-content -->
        <button
          class="fixed inset-0 bg-black opacity-0 transition-opacity duration-150 ease-in"
          (click)="btnCloseModal$.next(true)"
          [class]="{ 'opacity-60': isOpacity$ | async }"
        ></button>
        <div
          class="pointer-events-none fixed flex min-h-screen min-w-full items-center justify-center px-4 py-12"
        >
          <div
            class="pointer-events-auto opacity-0 transition-opacity duration-150 ease-in"
            [class]="{ 'opacity-100': isOpacity$ | async }"
          >
            <img class="hidden" src alt="" (error)="triggerOpacity$.next(true)" />
            <ng-container *ngComponentOutlet="item.component; inputs: { props: item.props }" />
          </div>
        </div>
      </div>
    }
  `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalContainerComponent {
  modals$ = getModals()
  triggerOpacity$ = getBehaviorSubject(false)
  btnCloseModal$ = getSubject<boolean>()

  isOpacity$ = this.triggerOpacity$.pipe(delay(10))

  closeModalSub = this.btnCloseModal$
    .pipe(
      takeUntilDestroyed(),
      tap(() => this.triggerOpacity$.next(false)),
      delay(150),
      tap(() => {
        closeModal()
      })
    )
    .subscribe()
}
