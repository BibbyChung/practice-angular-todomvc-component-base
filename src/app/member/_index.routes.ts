import { Routes } from '@angular/router'

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../lib/components/layout/member.layout.component').then(
        (c) => c.MemberLayoutComponent
      ),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home.component').then((c) => c.HomeComponent),
        // data: {
        //   id: 887,
        // },
        resolve: { id: () => 996 },
      },
      {
        path: 'about',
        loadComponent: () => import('./about.component').then((c) => c.AboutComponent),
      },
      {
        path: 'hello-world',
        loadComponent: () => import('./hello-world.component').then((c) => c.HelloWorldComponent),
      },
      {
        path: 'todomvc',
        loadComponent: () => import('./angular-todos/app.component').then((c) => c.TodosComponent),
      },
      {
        path: 'dynamic-cmp',
        loadComponent: () =>
          import('./dynamic-cmp/dynamic-cmp.component').then((c) => c.DynamicCmpComponent),
      },
      {
        path: 'ng-template',
        loadComponent: () =>
          import('./ng-template/ng-template.component').then((c) => c.NgTemplateComponent),
      },
      {
        path: 'reactive-form',
        loadComponent: () =>
          import('./reactive-form/form.component').then((c) => c.FormComponent),
      }
    ],
  },
]
export default routes
