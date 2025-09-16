# Prez UI v4 Theme Starter Template
This project was bootstrapped by `create-prez-app`.

## Quick start
In the project root directory, install with your NPM package manager of choice (we recommend [pnpm](https://pnpm.io)):

```bash
npm install
```

Then preview your theme by running:

```bash
npm run dev
```

## Configuration
### Environment Variables
The main configuration required for running Prez UI are done with environment variables:

Variable|Description|Type|Default
-|-|-|-
`NUXT_PUBLIC_PREZ_API_ENDPOINT` (required)|Configures the Prez API endpoint|string|-
`NUXT_PUBLIC_PREZ_AUTO_DETECT_HTML`|Enables rendering HTML in data|boolean|`false`
`NUXT_PUBLIC_PREZ_AUTO_DETECT_MARKDOWN`|Enables rendering markdown & mermaid diagrams in data|boolean|`false`

You can create an `.env` file in the project root to set these environment variable. See `.env.example` for all environment variable options and defaults. See [Nuxt Environment Variables](https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables) for more info on environment variables in Nuxt.

### Nuxt Config
The `nuxt.config.ts` file contains your configuration for Nuxt, which extends upon Prez UI's [base layer Nuxt config](https://github.com/rdflib/prez-ui/blob/main/packages/prez-ui/nuxt.config.ts). This is also where you can customise things like the HTML `<head>` content, such as setting the document title, adding extra CSS files, etc. This is also where you can set Vite config.

> [!NOTE]  
> Server-side rendering (SSR) is currently not supported, but will be implemented in the near future.

See the [Nuxt config docs](https://nuxt.com/docs/getting-started/configuration) for more info on how to configure Nuxt.

### App Config
The `app.config.ts` file contains your app-level config, where you can customise the navigation items, renaming items throughout the application, customising prepended items in the breadcrumbs, and pagination config. This app config extends upon Prez UI's [base layer app config](https://github.com/rdflib/prez-ui/blob/main/packages/prez-ui/app.config.ts).

## Extending your theme
This starter template uses [Nuxt](https://nuxt.com) [layers](https://nuxt.com/docs/getting-started/layers) to extend upon the base Prez UI layer application, so you only need to customise what you need.

Overriding pages, components, layouts, composables and utils can be done by simply creating a file of the same name in the same directory structure for Nuxt to automatically replace it with your version in the application. Refer to Prez UI's base layer [source code](https://github.com/rdflib/prez-ui/tree/main/packages/prez-ui) to help you override files.

> [!IMPORTANT]  
> When updating to a newer version of `prez-ui`, ensure any overridden files that contain core logic are kept up-to-date.

See our [theming documentation](https://github.com/rdflib/prez-ui/blob/main/docs/theming.md) for a more in-depth guide on customising Prez UI.

### Tailwind & CSS
Prez UI uses [Tailwind](https://tailwindcss.com) for most of its styling, which you can use in this starter template to easily style using classes.

To override Prez UI's colour scheme (e.g. `primary`, `secondary`, etc.), or add your own variables to use in Tailwind, simply add a CSS variable of the same name in `assets/css/tailwind.css` under `:root` with its colour values in HSL **without** commas between values. Dark mode variants of those variables goes in the `.dark` block. New variables are registered in the `@theme inline` block in the same file. For colours, prefix the variable with `--color-*`, e.g.:

```CSS
/* assets/css/tailwind.css */

...

:root {
    /* define your Tailwind CSS variables (in HSL without commas) here */

    /* overridden variables */
    --primary: hsl(24.6 95% 53.1%); 
    --primary-foreground: hsl(60 9.1% 97.8%);

    /* new variable */
    --my-new-variable: hsl(70 10.8% 91.3%);
}

.dark {
    /* dark mode variants of CSS variables go here */
}

@theme inline {
    ...
    /* any new tailwind variables you declare go here. Colours are prefixed with --color-* */
    --color-my-new-variable: var(--my-new-variable);
}
```

You can also style your Prez UI theme using normal CSS by adding your styles to `assets/css/theme.css`.

### Shadcn Components
Prez UI uses the [prez-components](https://github.com/rdflib/prez-ui/tree/main/packages/prez-components) component library, which is based on the [shadcn-vue](https://www.shadcn-vue.com) component library. Shad comes preinstalled in this starter template, but if you need to add more shadcn components in your theme, run a command like the following:

```bash
npx shadcn-vue@latest add <component>
```
*(Note: for pnpm, run `pnpm dlx` instead of `npx`)*

These components are stored in `components/ui`, which should be kept separate to your theme's components.
