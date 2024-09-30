import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'bb-empty-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="p-4">
      <router-outlet />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyLayoutComponent {}
