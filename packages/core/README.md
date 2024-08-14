# Prez UI v4 alpha setup

/packages
  /core - main PrezUI application
    /app - application/layers root
      /base - lib & components
      /tools - config, test tools (available via /_prez)
      /site - main PrezUI website pages and layouts
      app.config.ts - app default config
    nuxt.config.ts - system config

  /lib - build project for lib (source located in core/app/base/lib)

  /showcase - storybook site (not currently active)



## BDR PrezUI layer
- This layer application contains the customisations for BDR, that sits on top of a PrezUI core application


## How to run this layer

There are two ways to run this layer. 
- a) PrezUI core extends this layer: Currently used method. (requires cloning prez-ui)
- b) Layer extends PrezUI core: This method is not currently available yet. (extends prez-ui via a remote repo URL)

### a) Dev setup for - PrezUI core extends this layer
- create your project folder
- clone this repo, e.g. into /prez-ui-bdr-layer
- clone the prez-ui repo, e.g. into /prez-ui
- switch prez-ui branch to hjohns/next/alpha
- set the .env settings in prez-ui, as below.
- run "pnpm i", "pnpm dev" in the prez-ui/packages/core folder

.env settings (in prez-ui/packages/core)
```
NUXT_PUBLIC_PREZ_API_ENDPOINT=https://prez-api-endpoint
PREZ_CORE_EXTENDS=../prez-ui/packages/core
```

### b) Dev setup for - Layer extends PrezUI core
- __Note: this option is not ready yet__
- clone this repo (prez-ui-bdr-layer)
- set the .env settings
- run "pnpm i", "pnpm dev"

.env settings (in prez-ui-bdr-layer)
```
NUXT_PUBLIC_PREZ_API_ENDPOINT=https://prez-api-endpoint
PREZ_CORE_EXTENDS=../prez-ui/packages/core
```
