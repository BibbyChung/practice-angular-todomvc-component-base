import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core'
import { provideRouter, withComponentInputBinding } from '@angular/router'

import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding()
      // withPreloading(PreloadAllModules), // preload module strategy
    ),
  ],
}
