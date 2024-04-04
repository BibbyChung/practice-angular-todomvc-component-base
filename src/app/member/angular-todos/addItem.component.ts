import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap, tap } from 'rxjs';
import { getSubject } from '../../lib/common/utils';
import { addTodo } from '../../lib/services/todolist.service';

@Component({
  selector: 'bb-add-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <h1>todos</h1>
      <form (submit)="submitBtn$.next(true); $event.preventDefault()">
        <input #inputRef class="new-todo" placeholder="What needs to be done?" />
      </form>
    </header>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddItemComponent {
  inputRefS = viewChild.required<ElementRef<HTMLInputElement>>('inputRef');
  inputElem$ = toObservable(this.inputRefS).pipe(map((ref) => ref.nativeElement));

  submitBtn$ = getSubject<boolean>();

  submitSub = this.submitBtn$
    .pipe(
      takeUntilDestroyed(),
      switchMap(() => this.inputElem$),
      tap((inputElem) => {
        const v: string = inputElem.value;
        if (v !== '') {
          addTodo(v ?? '');
          inputElem.value = '';
        }
      }),
    )
    .subscribe();

  focusSub = this.inputElem$
    .pipe(
      takeUntilDestroyed(),
      tap((elem) => elem.focus()),
    )
    .subscribe();
}
