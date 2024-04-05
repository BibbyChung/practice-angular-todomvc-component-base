import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap, tap } from 'rxjs';
import { getJquery } from '../lib/services/layout.service';

@Component({
  selector: 'bb-bootstrap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #jqStartRootElem>
      <h1 class="jq-content text-danger h1">111</h1>
      <hr class="my-4" />
      <p>
        <a
          class="btn btn-primary"
          data-toggle="collapse"
          href="#collapseExample"
          role="button"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          Link with href
        </a>
        <button
          class="btn btn-primary mx-2"
          type="button"
          data-toggle="collapse"
          data-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          Button with data-target
        </button>
      </p>
      <div class="collapse mt-2" id="collapseExample">
        <div class="card card-body">
          Some placeholder content for the collapse component. This panel is
          hidden by default but revealed when the user activates the relevant
          trigger.
        </div>
      </div>

      <hr class="my-4" />

      <div class="card" style="width: 300px">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="180"
          aria-label="Placeholder: Image cap"
          class="prefix__bd-placeholder-img prefix__card-img-top"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="100%" height="100%" fill="#6c757d" />
          <text x="75px" y="75px" fill="#dee2e6" dy=".3em">Image cap</text>
        </svg>
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <p class="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <a href="#" (click)="$event.preventDefault()" class="btn btn-primary"
            >Go somewhere</a
          >
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BootstrapComponent {
  jqStartRootElem =
    viewChild.required<ElementRef<HTMLDivElement>>('jqStartRootElem');
  viewInit$ = toObservable(this.jqStartRootElem).pipe(
    map((ref) => ref.nativeElement),
  );

  jqElemRefSub = this.viewInit$
    .pipe(
      takeUntilDestroyed(),
      switchMap(() => getJquery()),
      tap(($) => {
        $('.jq-content').text('jquery change the content');
      }),
    )
    .subscribe();
}
