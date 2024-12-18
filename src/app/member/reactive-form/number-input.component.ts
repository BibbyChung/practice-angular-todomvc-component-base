/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  viewChild,
} from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms'
import IMask from 'imask'
import { Observer, tap } from 'rxjs'
import { getBehaviorSubject, getSubject } from '../../lib/common/utils'

@Component({
  selector: 'bb-number-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <input
      #ii
      [class]="classNameS()"
      [value]="value$ | async"
      (keyup)="value$.next(ii.value)"
      (focus)="focus$.next(true)"
      type="text"
    />
    <input type="hidden" [formControl]="formControl" />
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, // set NG_VALUE_ACCESSOR
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
})
export class NumberInputComponent implements ControlValueAccessor {
  injector = inject(Injector)
  classNameS = input.required<string>({ alias: 'className' })
  inputS = viewChild.required<ElementRef<HTMLInputElement>>('ii')

  formControl: FormControl = new FormControl()
  value$ = getBehaviorSubject('')
  focus$ = getSubject<boolean>()

  initInputSub = toObservable(this.inputS, { injector: this.injector })
    .pipe(
      tap((elemRef) => {
        IMask(elemRef.nativeElement, {
          mask: Number,
          scale: 2,
          signed: false,
          thousandsSeparator: ',',
          padFractionalZeros: false,
          normalizeZeros: false,
          radix: '.',
          mapToRadix: ['.'],
          min: -10000000000000000000000000000000000,
          max: 10000000000000000000000000000000000,
        })
      }),
      takeUntilDestroyed()
    )
    .subscribe()

  valueSub = this.value$
    .pipe(
      tap(() => {
        this.formControl.markAsDirty()
      }),
      tap((obj) => {
        const nObj = obj.replaceAll(',', '')
        const nu = parseFloat(nObj)
        this.formControl.setValue(isNaN(nu) ? '' : nu)
      }),
      takeUntilDestroyed()
    )
    .subscribe()

  focusSub = this.focus$
    .pipe(
      tap(() => {
        this.formControl.markAsTouched()
      }),
      takeUntilDestroyed()
    )
    .subscribe()

  writeValue(v?: number): void {
    this.formControl.setValue(v)
    this.value$.next(v?.toString() ?? '')
  }
  registerOnChange(fn: Partial<Observer<number>> | ((value: number) => void) | undefined): void {
    this.formControl.valueChanges.subscribe(fn)
  }
  registerOnTouched(fn: unknown): void {}
  setDisabledState?(isDisabled: boolean): void {}
}
