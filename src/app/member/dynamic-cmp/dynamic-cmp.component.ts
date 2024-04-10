import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ViewContainerRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { getSubject, getUUID } from '../../lib/common/utils';
import { TtMsgComponent } from './tt-msg.component';

@Component({
  selector: 'bb-dynamic-cmp',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn mx-1" (click)="addTTMsgComponent$.next(true)">
      create a hello word component
    </button>
    <button class="btn mx-1" (click)="changeDCmpName$.next(true)">
      change all dynamic component input
    </button>
    <button class="btn mx-1" (click)="removeAllCmps$.next(true)">
      remove all dynamic components
    </button>
    <hr />
    <ng-container #vc></ng-container>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicCmpComponent {
  // injector = inject(Injector);
  vcRef = viewChild.required('vc', {
    read: ViewContainerRef,
  });
  vcRef$ = toObservable(this.vcRef);
  addTTMsgComponent$ = getSubject<boolean>();
  changeDCmpName$ = getSubject<boolean>();
  dynamicCmps: ComponentRef<TtMsgComponent>[] = [];
  removeAllCmps$ = getSubject<boolean>();

  addTTMsgComponentSub = this.addTTMsgComponent$
    .pipe(
      takeUntilDestroyed(),
      switchMap(() => this.vcRef$),
      tap(async (vcRef) => {
        // The first approach (easy)
        const ttMsgComponent = await import('./tt-msg.component').then(
          (c) => c.TtMsgComponent,
        );
        const ttMsgComponentRef = vcRef.createComponent(ttMsgComponent);
        ttMsgComponentRef.setInput('msg', `my-uuid => ${getUUID()}`);
        ttMsgComponentRef.instance.sendMsg.subscribe((msg) => {
          console.log(msg);
        });
        // ttMsgComponentRef.changeDetectorRef.detectChanges();
        ttMsgComponentRef.changeDetectorRef.markForCheck();

        this.dynamicCmps.push(ttMsgComponentRef);
      }),
      // tap(async (vcRef) => {
      //   // The second approach
      //   const ttMsgComponent = await import('./tt-msg.component').then(
      //     (c) => c.TtMsgComponent,
      //   );
      //   const environmentInjector = this.injector.get(EnvironmentInjector);
      //   const ttMsgComponentRef = createComponent(ttMsgComponent, {
      //     environmentInjector: environmentInjector,
      //     elementInjector: this.injector,
      //   });
      //   ttMsgComponentRef.setInput('msg', `my-uuid => ${getUUID()}`);
      //   ttMsgComponentRef.instance.sendMsg.subscribe((msg) => {
      //     console.log(msg);
      //   });
      //   // ttMsgComponentRef.changeDetectorRef.detectChanges();
      //   ttMsgComponentRef.changeDetectorRef.markForCheck();
      //   vcRef.insert(ttMsgComponentRef.hostView);

      //   this.dynamicCmps.push(ttMsgComponentRef);
      // }),
    )
    .subscribe();

  changeDCmpNameSub = this.changeDCmpName$
    .pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.dynamicCmps.forEach((cmpRef) => cmpRef.setInput('msg', getUUID()));
      }),
    )
    .subscribe();

  removeAllCmpsSub = this.removeAllCmps$
    .pipe(
      takeUntilDestroyed(),
      switchMap(() => this.vcRef$),
      tap((viewContainer) => {
        viewContainer.clear();
      }),
    )
    .subscribe();
}
