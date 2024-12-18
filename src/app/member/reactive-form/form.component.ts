import { NumberInputComponent } from './number-input.component';
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { getSubject } from '../../lib/common/utils'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { filter, tap } from 'rxjs'

@Component({
  selector: 'bb-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NumberInputComponent],
  template: `
    <div class="max-w-screen-sm">
      <form
        class="flex flex-col items-start gap-4"
        (submit)="submit$.next(true)"
        [formGroup]="form01"
        novalidate
      >
        <div>i01: <input class="input w-80" type="number" formControlName="i01" /></div>
        <div>i02: <bb-number-input className="input w-80" formControlName="i02" /></div>
        <button class="btn">submit</button>
      </form>
      <div>
        {{form01.value|json}}
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  fb = inject(FormBuilder)

  submit$ = getSubject<boolean>()

  form01 = this.fb.group({
    i01: [''],
    i02: [''],
  })

  submitSub = this.submit$
    .pipe(
      filter(() => this.form01.valid),
      tap(() => {
        console.log(this.form01.value)
      }),
      takeUntilDestroyed()
    )
    .subscribe()
}
