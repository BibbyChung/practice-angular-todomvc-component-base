import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, tap } from 'rxjs';

@Component({
  selector: 'bb-tt-msg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="my-1 border border-solid border-pink-300 p-2">
      count: {{ count() }}, uuid-msg: {{ msg() }}
      <button class="btn" (click)="clickIt(); $event.preventDefault()">
        clickIt
      </button>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TtMsgComponent {
  msg = input.required<string>();
  sendMsg = output<string>();
  count = signal(0);

  intervalSub = interval(1000)
    .pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.count.update((pre) => pre + 1);
      }),
    )
    .subscribe();

  clickIt() {
    this.sendMsg.emit(this.msg());
  }
}
