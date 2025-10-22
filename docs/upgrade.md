# Upgrade guide from < v4.2.0
This guide is for users with an existing Prez UI theme upgrading from v4.1.2 and below to v4.2.0 and above. This is required as Prez UI now uses Nuxt v4, Tailwind v4 and shadcn-vue v2, which is incompatible with the previous version.

You can either use the provided script below to upgrade your Prez UI theme automatically, or follow the manual upgrade process below.

## Automatic Upgrade Script
We have provided a script which will automate the upgrade process ***except*** converting Tailwind CSS variables (and re-adding any extra shadcn component you may have installed), which you will have to do manually as per step [9](#9-update-tailwind-variables) below.

Run the command below in the root directory of your theme to perform the upgrade:

For Unix systems:
```bash
curl -s https://cdn.jsdelivr.net/gh/rdflib/prez-ui@main/scripts/upgrade.sh | sh
```

For Windows:
```powershell
Invoke-WebRequest https://cdn.jsdelivr.net/gh/rdflib/prez-ui@main/scripts/upgrade.ps1 -UseBasicParsing | Invoke-Expression
```

Once the script has run, follow step [9](#9-update-tailwind-variables) below to convert your Tailwind CSS variables.

## Manual Upgrade

> [!NOTE]
> If you use [pnpm](https://pnpm.io) (which we recommend), replace the npm commands below with the appropriate pnpm equivalents.

### 1. Uninstall old packages
First, uninstall the following packages by running:

```bash
npm uninstall @nuxtjs/tailwindcss radix-vue tailwindcss-animate
```

or 

```bash
pnpm remove @nuxtjs/tailwindcss radix-vue tailwindcss-animate
```

### 2. Update packages
Update the following packages to the latest version:

```bash
npm install tailwind-merge@latest nuxt@latest shadcn-nuxt@latest prez-ui@latest
```

or

```bash
pnpm update tailwind-merge nuxt shadcn-nuxt prez-ui --latest
```

If you also have `prez-lib` and/or `prez-components` installed, make sure to update them as well.

### 3. Install packages
Install the following packages:

```bash
npm install tailwindcss @tailwindcss/vite tw-animate-css reka-ui @vueuse/core
```

or

```bash
pnpm add tailwindcss @tailwindcss/vite tw-animate-css reka-ui @vueuse/core
```

### 4. Remove files
If you have any extra shadcn components added that didn't come with the default template, note them down to reinstall later. Then delete `tailwind.config.js` and the `ui/` directory in `components/`.

### 5. Move files into `app/`
Make a new top level directory `app/` and move the following files & directories into it where applicable:

- `assets/`
- `components/`
- `composables/`
- `layouts/`
- `lib/`
- `pages/`
- `utils/`
- `app.config.ts`
- `app.vue`

### 6. Update `nuxt.config.ts`
In `nuxt.config.ts`, remove `"@nuxtjs/tailwindcss"` from the modules array, import & add the `tailwindcss` Vite plugin, and add the following `shadcn` config:

```typescript
// nuxt.config.ts
import tailwindcss from "@tailwindcss/vite"; // <- add this line

export default defineNuxtConfig({
    // ...
    modules: [
      "@nuxtjs/tailwindcss" // <- remove this line
      "shadcn-nuxt",
      "@nuxtjs/color-mode",
    ],
    // ...
    vite: {
        plugins: [tailwindcss()], // <- add this line
    },
    // ...
    shadcn: { // <- add this object
        prefix: "",
        componentDir: "./app/components/ui"
    },
    // ...
});
```

### 7. Update `tsconfig.json`
Replace the contents of `tsconfig.json` with:

```json
{
    // https://nuxt.com/docs/guide/concepts/typescript
    "files": [],
    "references": [
        {
            "path": "./.nuxt/tsconfig.app.json"
        },
        {
            "path": "./.nuxt/tsconfig.server.json"
        },
        {
            "path": "./.nuxt/tsconfig.shared.json"
        },
        {
            "path": "./.nuxt/tsconfig.node.json"
        }
    ]
}
```

### 8. Copy shadcn components
Copy the content of `components.json` from the [template project](/packages/create-prez-app/template/components.json) into `components.json`:

```json
{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "new-york",
  "typescript": true,
  "tailwind": {
    "config": "",
    "css": "app/assets/css/tailwind.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "composables": "@/composables",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib"
  },
  "iconLibrary": "lucide"
}
```

Then copy the content of `app/lib/utils.ts` from the [template project](/packages/create-prez-app/template/app/lib/utils.ts) into `app/lib/utils.ts`:

Then copy the default shadcn components from the [template project](/packages/create-prez-app/template/app/components/ui/) into `app/components/ui/`.

### 9. Update Tailwind variables
Copy the contents of `app/assets/css/tailwind.css` into another file (e.g. `app/assets/css/tailwind.txt`) to save your current variables.

Then copy the contents of the [template CSS](/packages/create-prez-app/template/app/assets/css/tailwind.css) file into `app/assets/css/tailwind.css`.

Then add any overridden or custom Tailwind CSS variables from your backup Tailwind file back into `app/assets/css/tailwind.css`. Variables are now declared using `hsl()` without commas between values in `:root`. You can add dark mode variants of these in `.dark`. To use new variables in Tailwind, register then in `@theme inline` below the default variables. Colours are prefixed with `--color-*`. For example:

```CSS
/* app/assets/css/tailwind.css */

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

Lastly, as usual with developing Prez UI themes, check if any overridden components need to be updated from the Prez UI source code to prevent unexpected issues.

### 10. (Optional) Re-add remaining shadcn components
If you noted down any extra shadcn components that were installed, first run:

```bash
npx nuxi prepare
```

or

```bash
pnpm dlx nuxi prepare
```

Then re-add the components you noted down by running the following command (with spaces separating the components):

```bash
npx shadcn-vue@latest add <components>
```

or

```bash
npm dlx shadcn-vue@latest add <components>
```