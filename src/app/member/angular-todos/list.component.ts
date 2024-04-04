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
import {
  delTodo,
  getTodos,
  setAllTodosCompleted,
  todoType,
  updateTodo,
} from '../../lib/services/todolist.service';
import { AddItemComponent } from './addItem.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'bb-list',
  standalone: true,
  imports: [CommonModule, AddItemComponent, FooterComponent],
  template: `
    <section class="todoapp">
      <bb-add-item />
      <section class="main">
        <input
          #checkBoxElemRef
          id="toggle-all"
          class="toggle-all"
          type="checkbox"
          (change)="checkSelectAllBtn$.next(true)"
        />
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          @for (item of todos$ | async; track $index) {
            <li [ngClass]="{ completed: item.completed }">
              <div class="view">
                <input
                  #inputElem
                  class="toggle"
                  type="checkbox"
                  [checked]="item.completed"
                  (change)="updateItemBtn$.next({ $event, todo: item })"
                />
                <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
                <label>{{ item.title }}</label>
                <!-- eslint-disable-next-line @angular-eslint/template/elements-content -->
                <button
                  (click)="destroyBtn$.next(item.id)"
                  class="destroy"
                ></button>
              </div>
            </li>
          }
        </ul>
      </section>
      <bb-footer />
    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  todos$ = getTodos();

  checkBoxElemRefS =
    viewChild.required<ElementRef<HTMLInputElement>>('checkBoxElemRef');
  checkBoxElem$ = toObservable(this.checkBoxElemRefS).pipe(
    map((ref) => ref.nativeElement),
  );

  checkSelectAllBtn$ = getSubject<boolean>();
  destroyBtn$ = getSubject<string>();
  updateItemBtn$ = getSubject<{ $event: Event; todo: todoType }>();

  checkSelectAllSub = this.checkSelectAllBtn$
    .pipe(
      takeUntilDestroyed(),
      switchMap(() => this.checkBoxElem$),
      switchMap((elem) => setAllTodosCompleted(elem.checked)),
    )
    .subscribe();

  destroySub = this.destroyBtn$
    .pipe(
      takeUntilDestroyed(),
      tap((id) => delTodo(id)),
    )
    .subscribe();

  toggleCheckboxSub = this.todos$
    .pipe(
      takeUntilDestroyed(),
      map((todos) => {
        const total = todos.length;
        const selectedCount = todos.filter((a) => a.completed).length;
        if (total === 0) {
          return false;
        }
        return total === selectedCount;
      }),
      switchMap((isSelected) =>
        this.checkBoxElem$.pipe(
          tap((elem) => {
            elem.checked = isSelected;
          }),
        ),
      ),
    )
    .subscribe();

  updateItemSub = this.updateItemBtn$
    .pipe(
      takeUntilDestroyed(),
      map((obj) => ({
        isChecked: (obj.$event.target as HTMLInputElement).checked,
        todo: obj.todo,
      })),
      tap((info) => {
        const newObj = JSON.parse(JSON.stringify(info.todo)) as todoType;
        newObj.completed = info.isChecked;
        updateTodo(newObj);
      }),
    )
    .subscribe();
}
