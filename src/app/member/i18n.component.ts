import { i18nT } from './../lib/services/i18n.service'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'bb-i18n',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>{{ t('TITLE') }}</h1>
    <span>{{ t('AI_MODE') }}</span>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class I18nComponent {
  t = i18nT
}
