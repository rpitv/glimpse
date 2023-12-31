# Glimpse UI

<img src="https://imgur.com/dmZSyhe.png" width="200px" alt="RPI TV Glimpse Logo" />


[![codecov](https://codecov.io/gh/rpitv/glimpse-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/rpitv/glimpse-ui)
[![Build Status](https://travis-ci.com/rpitv/glimpse-ui.svg?branch=master)](https://travis-ci.com/rpitv/glimpse-ui)
[![License](https://img.shields.io/badge/license-GNU%20GPL%20v3.0-blue)](./LICENSE)

This is the frontend UI for Glimpse, the RPI TV website.

## Quick Start

1. Create/import the `.npmrc` and `.env` files.
2. `npm install`
3. Run `npm run dev` to start the server in development mode.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run build
npm run test:e2e # or `npm run test:e2e:ci` for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Build Docker Image

```sh
docker build --tag rpitv/glimpse-ui --secret id=npmrc,src=.npmrc .
```
