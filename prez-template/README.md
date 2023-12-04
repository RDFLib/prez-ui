# Prez UI Template
This is a template of creating a themed instance of the refactored version of Prez UI in Nuxt 3. By using Nuxt layers, you can override & customise Prez UI's components & pages.

This project will aim to be easily pulled to quickly spin up instances by converting this project into an NPX starter template by running a command like:

```bash
npx create prez-template
```

which will create a Nuxt projects as a good starting template to run & customise Prez UI.

## Extending the Prez UI layer
Prez UI can be customised by extending the `prez-ui` project as [Nuxt layer](https://nuxt.com/docs/getting-started/layers). Nuxt layers expose the following folders & files to be extended:

- `components/*`
- `composables/*`
- `pages/*`
- `server/*`
- `utils/*`
- `nuxt.config.ts`
- `app.config.ts`

For Prez UI, pages & components can be overridden by adding a file in this project following the same directory structure, e.g. `pages/c/catalogs.vue` will override the catalogs page. Otherwise this project will inherit all components and pages from `prez-ui` and function normally.