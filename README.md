# README

```bash

pnpm add bootstrap@4.6.2 jquery@3.5.1 popper.js@1.16.1 @types/jquery@3.5.29

```

```ts

import 'bootstrap/dist/js/bootstrap';
import 'jquery/dist/jquery';
import 'popper.js/dist/popper';
import * as jq from 'jquery';

setJquery(jq.default);


// jquery
const jquery$ = getBehaviorSubject<JQueryStatic | null>(null);
export const setJquery = (jquery: JQueryStatic) => jquery$.next(jquery);
export const getJquery = () =>
  jquery$.pipe(
    filter((a) => !!a),
    map((a) => a!),
  );

```

```scss

@tailwind base;
// @tailwind components;
// @tailwind utilities;

@import url('../node_modules/bootstrap/dist/css/bootstrap.min.css');

```

---

# Ng17

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
