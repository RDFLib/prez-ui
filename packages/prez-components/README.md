# Prez Components
A Vue.js component library for rendering RDF data for use with Prez UI. Uses [`prez-lib`](https://github.com/rdflib/prez-ui/tree/main/packages/prez-lib) for RDF/JS types and processing RDF.

Based on the [shadcn-vue](https://www.shadcn-vue.com) component library.

## Install

```bash
npm install prez-components
```

## Usage

```vue
<script lang="ts" setup>
import { literal, node } from "prez-lib";
import { Node } from "prez-components";

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
import "prez-components/style.css";
```

For Nuxt:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
    ...
    css: ["prez-components/style.css"],
    ...
});
```
