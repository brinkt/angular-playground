# Angular Playground

To develop and refine third-party `@angular` modules by combining their use cases in an "anything goes" development environment.

__TABLE OF CONTENTS__

* [Live Demo](https://brinkt.github.io/angular-playground/)
* [Module: auth](#module-auth)
* [Module: content-builder](#module-content-builder)
* [Module: dual-backend](#dual-backend)
* [Module: pages](#pages)
* [Module: users](#users)
* [Developer Guide](#developer-guide)

## Module: auth

A complete user authentication solution using `JWT` which includes:

  * Registration
  * Authentication
  * Account activation
  * Password recovery
  * Account unlock instructions (too many failed login attempts)
  * E-mail, password, username changing capability

[source](https://github.com/brinkt/angular-playground/tree/master/src/app/auth)

## Module: content-builder

A drag n' drop web content editor using [dragula](https://github.com/bevacqua/dragula) &amp; [ng2-dragula](https://github.com/valor-software/ng2-dragula) that uses multiple pre-determined grid layouts.

Content elements currently supported are:

  * Text (h1, h2, h3, p)
  * Quote (w/ author)
  * Youtube (embedded video)

[source](https://github.com/brinkt/angular-playground/tree/master/src/app/content-builder)

## Module: dual-backend

Uses `localstorage` on the web browser as a database through custom service `LocalStorageDatabase` to load & manipulate data objects in memory.

Loads mock data from `/src/assets` into memory as initial database. Users are generated from top 100 first and last names randomly. Pages are loaded from `.json` files.

Intercepts `HttpClient` requests, processing them if their respective route exits, otherwise passing them through to the backend untouched.

This allows deployment on `Github Pages` to mimic actual backend in demo without a real backend.

Module can be removed and all `HttpClient` requests to an actual backend will passthrough as expected.

[source](https://github.com/brinkt/angular-playground/tree/master/src/app/dual-backend)

## Module: pages

The home page is created with `content-builder`, so can other pages. Explore `CRUD` aspects of pages.

[source](https://github.com/brinkt/angular-playground/tree/master/src/app/pages)

## Module: users

Much like many social media platforms, users can `follow` and `be followed` by other users. Users also have a profile page with public content they wish to display.

[source](https://github.com/brinkt/angular-playground/tree/master/src/app/users)

## Development Guide

### Installation

To get started, clone this repo, then run:

```
npm install
```

This will install all software prerequisites to the `node_modules` directory.

### Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

The app will automatically reload if you change any of the source files.

### Code Scaffolding

Run `ng generate component component-name` to generate a new component.

You can also use `ng generate directive|pipe|service|class|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

Use the `-prod` flag for a production build.

### Running Unit Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running End-to-end Tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

Before running the tests make sure you are serving the app via `ng serve`.

### Deploying to Github Pages

Install [angular-gh-pages-deploy](https://github.com/brinkt/angular-gh-pages-deploy) script.

Then, from within this path, run:

```
angular-gh-pages-deploy
```

### Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
