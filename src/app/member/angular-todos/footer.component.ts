import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, switchMap, tap } from 'rxjs';
import { getSubject } from '../../lib/common/utils';
import {
  getTodos,
  getTodosFilter,
  removeAllTodosCompleted,
  setTodosFilter,
  todosFilterType,
} from '../../lib/services/todolist.service';

@Component({
  selector: 'bb-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <span class="todo-count">
        @if ((uncompletedCount$ | async) === 1) {
          1 uncompleted item left
        } @else {
          {{ uncompletedCount$ | async }} uncompleted items left
        }
      </span>
      <ul class="filters">
        <li>
          <a
            (click)="setTodosFilterBtn$.next('all'); $event.preventDefault()"
            href="#/"
            [ngClass]="{ selected: (todoFilter$ | async) === 'all' }"
            >All</a
          >
        </li>
        <li>
          <a
            (click)="setTodosFilterBtn$.next('active'); $event.preventDefault()"
            href="#/"
            [ngClass]="{ selected: (todoFilter$ | async) === 'active' }"
            >Active</a
          >
        </li>
        <li>
          <a
            (click)="
              setTodosFilterBtn$.next('completed'); $event.preventDefault()
            "
            href="#/"
            [ngClass]="{ selected: (todoFilter$ | async) === 'completed' }"
            >Completed</a
          >
        </li>
      </ul>
      <div>
        @if (isShowClearCompleted$ | async) {
          <button
            (click)="removeAllTodosBtn$.next(true)"
            class="clear-completed"
          >
            Clear completed
          </button>
        }
      </div>
    </footer>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  removeAllTodosBtn$ = getSubject<boolean>();
  setTodosFilterBtn$ = getSubject<todosFilterType>();
  todos$ = getTodos();
  todoFilter$ = getTodosFilter();

  isShowClearCompleted$ = this.todos$.pipe(
    map((todos) => {
      const completedCount = todos.filter((a) => a.completed).length;
      return completedCount !== 0;
    }),
  );

  uncompletedCount$ = this.todos$.pipe(
    map((todos) => todos.filter((a) => !a.completed).length),
  );

  setTodosFilterSub = this.setTodosFilterBtn$
    .pipe(
      takeUntilDestroyed(),
      tap((type) => setTodosFilter(type)),
    )
    .subscribe();

  removeAllTodosSub = this.removeAllTodosBtn$
    .pipe(
      takeUntilDestroyed(),
      switchMap(() => removeAllTodosCompleted()),
    )
    .subscribe();
}
