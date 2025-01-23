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

## Developing `prez-components`
### Install & Run

Run in the project root:
```bash
pnpm install
```

and to run:
```bash
pnpm dev
```

### Writing Components for Overriding
To support deep overriding of components in Nuxt layers, components in this library need their prop type declared in `types.ts`, and any child component dependencies in the component library need to be declared in a `components` object in the props:

```typescript
// types.ts
export interface MyComponentProps {
    // your prop types here
    _components?: {
        childComponent: Component,
    };
};
```

Using these child components must be done dynamically with defaults:

```vue
// src/components/MyComponent.vue
<script lang="ts" setup>
import { MyComponentProps } from "@/types";
import childComponent from "./ChildComponent.vue";

const props = withDefaults(defineProps<MyComponentProps>(), {
    _components: () => {
        return {
            childComponent: ChildComponent,
        }
    }
});
</script>

<template>
    <component :is="props._components.childComponent" />
</template>
```