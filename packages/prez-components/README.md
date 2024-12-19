# Prez Components
A Vue.js component library for rendering RDF data for use with Prez UI. Uses [`prez-lib`](https://github.com/jamiefeiss/prez-ui/tree/jamie/next/shad-layer-fix/packages/prez-lib) for RDF/JS types and processing RDF.

Based on the [shadcn-vue](https://www.shadcn-vue.com) component library.

## Install

```bash
npm install prez-components-test
```

## Usage

```vue
<script lang="ts" setup>
import { literal, node } from "prez-lib-test";
import { Node } from "prez-components-test";

const term = node({
    value: "https://example.com",
    label: literal("term"),
    links: [
        {
            value: "/"
        }
    ],
});
</script>

<template>
    <div>
        <Node :term="term" />
    </div>
</template>
```

Make sure to import the `prez-components` stylesheet:

```typescript
// main.ts
import "prez-components-test/style.css";
```

For Nuxt:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
    ...
    css: ["prez-components-test/style.css"],
    ...
});
```
