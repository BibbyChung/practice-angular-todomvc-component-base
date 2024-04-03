import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { getBehaviorSubject } from '../lib/common/utils';

type ItemType = { name: string };

@Component({
  selector: 'bb-hello-world',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-x-6">
      <div>
        <input
          class="bg-gray-200"
          type="text"
          [value]="nameS()"
          (keyup)="change($event)"
        />
        <br />
        Hello {{ nameS() }} !
      </div>
      <div>
        <button
          class="rounded border border-gray-300 bg-slate-400 px-2 text-gray-50"
          (click)="toggerItems($event)"
        >
          trigger items
        </button>
        @if (items$ | async; as vv) {
          @if (vv?.length ?? 0 > 0) {
            <ul>
              @for (item of vv!; track $index) {
                <li>{{ item.name }} => {{ $index }}</li>
              }
            </ul>
          }
        }
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelloWorldComponent implements OnInit {
  protected defaultValue = [
    {
      name: 'Bibby',
    },
    {
      name: 'Andy',
    },
    {
      name: 'RR',
    },
  ];
  protected greetingClicked = output<string>();
  protected items$ = getBehaviorSubject<ItemType[]>([]);
  protected nameS = signal('BBB_CCC');

  ngOnInit(): void {
    this.items$.next(this.defaultValue);
    this.greetingClicked.emit('test');
  }

  change($event: KeyboardEvent) {
    const elem = $event.target as HTMLInputElement;
    this.nameS.set(elem.value);
  }

  toggerItems($event: MouseEvent) {
    if (this.items$.getValue().length === 0) {
      this.items$.next(this.defaultValue);
    } else {
      this.items$.next([]);
    }

    $event.preventDefault();
  }
}
