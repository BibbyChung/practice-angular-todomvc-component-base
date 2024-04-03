import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../lib/components/layout/member.layout.component').then(
        (c) => c.MemberLayoutComponent,
      ),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home.component').then((c) => c.HomeComponent),
        // data: {
        //   id: 887,
        // },
        resolve: { id: () => 996 },
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./about.component').then((c) => c.AboutComponent),
      },
      {
        path: 'hello-world',
        loadComponent: () =>
          import('./hello-world.component').then((c) => c.HelloWorldComponent),
      },
    ],
  },
];
export default routes;
