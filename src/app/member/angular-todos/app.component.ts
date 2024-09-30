import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ListComponent } from './list.component'

@Component({
  selector: 'bb-todos',
  standalone: true,
  imports: [CommonModule, ListComponent],
  template: `
    <div class="flex justify-center">
      <div class="min-w-2xl max-w-xl">
        <bb-list />
        <footer class="info">
          <p>Created by <a href="http://twitter.com/bibbynet">Bibby</a></p>
          <p>Reference to <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent {}
