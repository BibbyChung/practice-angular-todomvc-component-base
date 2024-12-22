import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { MenuComponent } from '../menu.component'

@Component({
    selector: 'bb-member-layout',
    template: `
    <bb-menu />
    <hr />
    <main class="p-4">
      <router-outlet />
    </main>
  `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterOutlet, MenuComponent]
})
export class MemberLayoutComponent {}
