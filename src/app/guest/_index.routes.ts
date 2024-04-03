import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../lib/components/layout/empty.layout.component').then(
        (c) => c.EmptyLayoutComponent,
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./login.component').then((c) => c.LoginComponent),
      },
    ],
  },
];
export default routes;
