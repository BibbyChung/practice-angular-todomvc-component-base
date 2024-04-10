import { Directive, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[templateContextType]',
  standalone: true,
})
export class TemplateContextTypeGuardDirective<T> {
  @Input('templateContextType')
  type!: T;
  // templateContextType = input.required<T>();

  static bbTemplateContextGuard<T>(
    _dir: TemplateContextTypeGuardDirective<T>,
    ctx: unknown,
  ): ctx is T {
    return true;
  }
}
