import { CommonModule, NgComponentOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { getModals } from '../../services/layout.service'

@Component({
  selector: 'bb-modal-container',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  template: `
    @for (item of modals$ | async; track $index) {
      <div class="fixed inset-0 z-20 h-screen w-screen overflow-y-auto">
        <div class="fixed inset-0 bg-black opacity-40"></div>
        <div class="fixed flex min-h-screen min-w-full items-center justify-center px-4 py-12">
          <ng-container *ngComponentOutlet="item.component; inputs: { props: item.props }" />
        </div>
      </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalContainerComponent {
  modals$ = getModals()
  constructor() {}
}
