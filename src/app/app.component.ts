import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, Renderer2, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ModalContainerComponent } from './lib/components/modal/modal-container.component';
import {
  setIsClient,
  setRender,
  setRouter,
  setWindow,
} from './lib/services/layout.service';

@Component({
  selector: 'bb-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ModalContainerComponent],
  template: `
    <router-outlet />
    <bb-modal-container />
  `,
  styles: [],
})
export class AppComponent {
  // title = 'ng17';
  platformId = inject(PLATFORM_ID);
  document = inject(DOCUMENT);
  render = inject(Renderer2);
  router = inject(Router);

  constructor() {
    setIsClient(isPlatformBrowser(this.platformId));
    setWindow(this.document.defaultView?.window ?? null);
    setRender(this.render);
    setRouter(this.router);
  }
}
