import {
  ApplicationConfig,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    // ɵprovideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
    ), provideClientHydration(),
  ],
};
