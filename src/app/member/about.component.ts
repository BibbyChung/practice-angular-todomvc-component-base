import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { getSubject } from '../lib/common/utils';
import { notify } from '../lib/services/layout.service';

@Component({
  selector: 'bb-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>abount works!</p>
    <button class="btn" (click)="showSuccess$.next(true)">
      notify success
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected showSuccess$ = getSubject<boolean>();

  showSuccessSub = this.showSuccess$
    .pipe(
      takeUntilDestroyed(),
      switchMap(() => notify('success', '成功啦啦啦啦啦')),
    )
    .subscribe();
}
