# Prez UI base layer
This is the Nuxt application of Prez UI as a base layer for theme extension.

## Install
We recommend you bootstrap your Prez UI instance using `create-prez-app`, which comes with `prez-ui` preinstalled.

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

## Developing Prez UI
### Install & Run

Run in the project root:
```bash
pnpm install
```

For running prez-ui, *ensure you build the workspace dependencies first* - prez-lib and prez-components. The you can run in the prez-ui directory:
```bash
pnpm dev
```

### Re-exporting `prez-components` Components in `prez-ui`
For supporting deep overrides in extending Prez UI's base layer, any components that are made available to Nuxt from the `prez-components` component library must be re-exported in `prez-ui/components/` in the following way:

```vue
<script lang="ts" setup>
import { Literal, type LiteralProps } from "prez-components";

const props = defineProps<LiteralProps>();
const term = resolveComponent("Term") as Component;
</script>

<template>
    <Literal v-bind="props" :_components="{term}">
        <template #default="slotProps"><slot v-bind="slotProps" /></template>
        <template #text="slotProps"><slot name="text" v-bind="slotProps" /></template>
        <template #language="slotProps"><slot name="language" v-bind="slotProps" /></template>
        <template #datatype="slotProps"><slot name="datatype" v-bind="slotProps" /></template>
    </Literal>
</template>

```

This takes advantage of Nuxt's auto-importing to allow for dependant components to be overridden in layer themes automatically. For example, consider the following component structure:

```vue
// ComponentA.vue

<template>
    <ComponentB />
<template>
```

```vue
// ComponentB.vue

<template>
    <ComponentC />
<template>
```

```vue
// ComponentC.vue

<template>
    Component C's base content
<template>
```

If `ComponentC` was overridden in a theme, ComponentB and ComponentA will render using the new component without having to be overridden themselves.
