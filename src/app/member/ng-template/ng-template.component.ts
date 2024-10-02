import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  TemplateRef,
  ViewContainerRef,
  inject,
  viewChild,
} from '@angular/core'
import { getSubject, getUUID } from '../../lib/common/utils'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { combineLatest, switchMap, tap } from 'rxjs'

@Component({
  selector: 'bb-ng-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-template #sTmp let-ctx>
      <div class="my-2 border border-purple-400 p-2">
        <div>{{ ctx.title }}</div>
        <div>{{ ctx.description }}</div>
      </div>
    </ng-template>

    @for (item of [0, 1, 2]; track $index) {
      <ng-container
        *ngTemplateOutlet="
          sTmp;
          context: {
            $implicit: {
              title: 's-title' + item,
              description: 's-description' + item
            }
          }
        "
      ></ng-container>

      <!-- <ng-container
        [ngTemplateOutlet]="sTmp"
        [ngTemplateOutletContext]="{
          $implicit: {
            title: 's-title' + item,
            description: 's-description' + item
          }
        }"
      ></ng-container> -->
    }

    <hr class="my-2" />

    <ng-template #dTmp let-title="title" let-description="description">
      <div class="my-2 border border-red-600 p-2">
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
    </ng-template>

    <button class="btn" (click)="cloneTmp$.next(true)">create content by ng-template</button>

    <ng-container #vc></ng-container>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgTemplateComponent {
  injector = inject(Injector)
  cloneTmp$ = getSubject<boolean>()
  vcRef = viewChild.required('vc', { read: ViewContainerRef })
  dTmpRef = viewChild.required('dTmp', { read: TemplateRef })

  cloneTmpSub = this.cloneTmp$
    .pipe(
      takeUntilDestroyed(),
      switchMap(() =>
        combineLatest([
          toObservable(this.vcRef, { injector: this.injector }),
          toObservable(this.dTmpRef, { injector: this.injector }),
        ])
      ),
      tap(([vcRef, tmpRef]) => {
        const embeddedview = tmpRef.createEmbeddedView({
          title: `title(${getUUID()})`,
          description: '六六六...',
        })
        vcRef.insert(embeddedview)
        embeddedview.markForCheck()
      })
    )
    .subscribe()
}
