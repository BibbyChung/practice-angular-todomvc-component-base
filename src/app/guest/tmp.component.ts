import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
    selector: 'bb-tmp',
    imports: [CommonModule],
    template: ` <p>tmp</p> `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmpComponent {
  constructor() {}
}
