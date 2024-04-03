import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, tap } from 'rxjs';
import { getSubject } from '../../common/utils';
import { closeModal } from '../../services/layout.service';

export type ModalConfirmType = {
  msg: string;
  ok$: Subject<boolean>;
};

@Component({
  selector: 'bb-modal-confirm',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="relative m-0 flex flex-col rounded-md bg-gray-50 sm:my-16 sm:min-w-[40vw]"
    >
      <header class="flex items-center justify-between p-4">
        <h2 class="m-0 max-w-[calc(100%_-_3rem)] text-xl font-medium">Info</h2>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition-colors duration-300 hover:bg-black/10"
          (click)="close$.next(false)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </header>
      <main class="relative flex-[1_1_auto] p-4" style="--size: 32rem">
        <p>{{ props().msg }}</p>
      </main>
      <footer
        class="flex flex-shrink-0 flex-row flex-wrap items-center justify-end gap-1 p-4"
        style="--size: 32rem"
      >
        <button type="button" class="btn" (click)="close$.next(false)">
          <span class="flex items-center justify-center space-x-2">Close</span>
        </button>
        <button type="button" class="btn" (click)="props().ok$.next(true)">
          <span class="flex items-center justify-center space-x-2">
            confirm
          </span>
        </button>
      </footer>
    </article>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalConfirmComponent {
  props = input.required<ModalConfirmType>();
  close$ = getSubject<boolean>();

  closeSub = this.close$
    .pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.props().ok$.next(false);
      }),
      tap(() => closeModal()),
    )
    .subscribe();

  constructor() {}
}
