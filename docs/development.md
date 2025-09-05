# Development

## Contents
- [Install & Run](#install--run)
    - [Taskfile](#taskfile)
- [Developing Packages](#developing-packages)
    - [Prez Lib](#prez-lib)
    - [Prez Components](#prez-components)
    - [Prez UI](#prez-ui)
- [Testing](#testing)
    - [Type checking](#type-checking)
    - [Testing the template](#testing-the-template)
    - [Testing a theme against new versions/branches](#testing-a-theme-against-new-versionsbranches)
    - [Installing local packages](#installing-local-packages)

## Install & Run
For running this workspace locally for development on the core codebase, [PNPM](https://pnpm.io) is required to be installed. First, install the workspace at the project root:

```bash
pnpm install
```

To run the Prez UI Nuxt application, you need to build `prez-lib`, then `prez-components` as they are dependencies. Run:

```
pnpm build
```

in `packages/prez-lib` then `packages/prez-components` in that order.

Now that the package dependencies have been built, you can run Prez UI. In `packages/prez-ui`, run:

```bash
pnpm dev
```

See the READMEs for each package for more detailed documentation.

### Taskfile
A Taskfile has been provided for convenience for developers to easily get started running this workspace as an alternative to the above commands.

For running Prez UI:

```bash
task run
```

This will run the install & build commands mentioned above before running the Nuxt application.

See the [Taskfile](/Taskfile.yaml) for available commands.

## Developing Packages

### Prez Lib

### Prez Components
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

### Prez UI
For running prez-ui, *ensure you build the workspace dependencies first* - `prez-lib` and `prez-components`.

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

## Testing

### Type checking
Each package uses TypeScript and has a type check command to check for TypeScript errors:

```bash
pnpm types
```

The [Taskfile](/Taskfile.yaml) also contains these commands, as well as a "type check all" command.

### Testing the template
An important step for testing major changes is to ensure that the theming still works using the template.

1. Copy the project in `create-prez-app/template/` to a local directory outside this project
2. Remove `prez-ui` from devDependencies in `package.json`
3. Change "extends" in `nuxt.config.ts` to the relative path to the `prez-ui` Nuxt project
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
    extends: [
        "../prez-ui/packages/prez-ui" // relative path to this project
    ],
});
```
4. Install dependencies and run

From here, test various theming features such as styling changes and overriding components - *especially* overriding deep components, i.e. components that aren't called directly but are called by other components.

Note that creating new overridden components usually requires restarting the dev server.

### Testing a theme against new versions/branches
For existing themes, you can point the layer to extend to a specific version or branch by changing the "extends" field in `nuxt.config.ts`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
    extends: [
        "github:rdflib/prez-ui/packages/prez-ui#branch", // for targeting a branch
        // or
        "github:rdflib/prez-ui/packages/prez-ui#v4.x.x", // for targeting a version
    ],
});
```

### Installing local packages
If `prez-lib` or `prez-components` need to be installed in a theme for local testing, you can run `pnpm add` on local directories, as long as they're built, e.g.:

```bash
pnpm add ../prez-ui/packages/prez-lib
```
