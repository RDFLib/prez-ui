# Upgrade guide from < v4.2.0
This guide is for users with an existing Prez UI theme upgrading from v4.1.2 and below to v4.2.0 and above. This is required as Prez UI now uses Tailwind v4 and shadcn-vue v2, which is incompatible with the previous version.

> [!NOTE]
> If you use [pnpm](https://pnpm.io) (which we recommend), replace the npm commands below with the appropriate pnpm equivalents.

## 1. Uninstall unused packages

First, uninstall the following packages by running:

```bash
npm uninstall @nuxtjs/tailwindcss radix-vue
```

## 2. Remove required files & folders
Delete `components.json`, `tailwind.config.js` & the `ui/` directory in `components/`.

## 3. Backup Tailwind variables
Copy the contents of `tailwind.css` into another file (e.g. `tailwind.txt`) to save your current variables, then clear the contents of `tailwind.css`.

## 4. Update packages to latest
Update packages to ***latest***. Start by running:

```bash
npm update
```

Packages with major version updates won't be updated. You can check by running:

```bash
npm outdated
```

Then update the remaining packages to latest by running:

```bash
npm update <package>@latest
```

(`shadcn-nuxt` & `tailwind-merge` MUST be updated to latest for this upgrade to work)

## 5. Install Tailwind 4

```bash
npm install tailwindcss @tailwindcss/vite
```

Copy this into your `tailwind.css` file:
```css
@import "tailwindcss";
```

Insert the following into your `nuxt.config.ts` file:

```typescript
// nuxt.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    ...
    vite: {
        plugins: [tailwindcss()],
    },
    ...
})
```
## 6. Reinitialise shadcn-vue
Run the initialiser for shadcn-vue:

```bash
npx shadcn-vue@latest init
```

(When prompted for the base colour, "slate" is the default base colour for Prez UI)

Insert the following into your `nuxt.config.ts` file:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
    ...
    shadcn: {
        prefix: "",
        componentDir: "./components/ui"
    },
    ...
})
```

The add the default shad components back:

```bash
npx shadcn-vue@latest add badge button input pagination
```

## 7. Update `tailwind.css`
Copy the contents of the [template CSS](/packages/create-prez-app/template/assets/css/tailwind.css) file into `tailwind.css`.

Then add any overridden or custom Tailwind CSS variables from your backup Tailwind file back into `tailwind.css`. Variables are now declared using `hsl()` without commas between values in `:root`. You can add dark mode variants of these in `.dark`. To use new variables in Tailwind, register then in `@theme inline` below the default variables. Colours are prefixed with `--color-*`. For example:

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

## 8. Check overridden components (optional)
As usual, check if any overridden components need to be updated from the Prez UI source code to prevent unexpected issues.
