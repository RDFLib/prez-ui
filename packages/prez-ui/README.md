# Prez UI base layer
This is the Nuxt application of Prez UI as a base layer for theme extension.

## Install
To install this layer for extending your own Prez UI theme, run:

```bash
npm install -D prez-ui
```

and add the base layer to `extends` in your Nuxt config:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
    ...
    extends: [
        "prez-ui"
    ]
    ...
});
```

See the [theming documentation](https://github.com/rdflib/prez-ui/blob/main/docs/theming.md) on how to customise your Prez UI theme.
