import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'guest/bootstrap',
  },
  {
    path: 'member',
    loadChildren: () => import('./member/_index.routes'),
  },
  {
    path: 'guest',
    loadChildren: () => import('./guest/_index.routes'),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
