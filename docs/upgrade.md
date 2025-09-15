# Upgrade guide from < v4.2.0
This guide is for users with an existing Prez UI theme upgrading from v4.1.2 and below to v4.2.0 and above. This is required as Prez UI now uses Tailwind v4 and shadcn-vue v2, which is incompatible with the previous version.

Running the script below will automate the upgrade process ***except*** converting Tailwind CSS variables, which you will have to do manually as per step [8](#8-update-tailwindcss) below.

For Unix systems:
```bash
curl -s https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/tailwind4/upgrade.sh | sh
```

For Windows:
```powershell
Invoke-WebRequest https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/tailwind4/upgrade.ps1 -UseBasicParsing | Invoke-Expression
```
Otherwise, follow the steps below.

> [!NOTE]
> If you use [pnpm](https://pnpm.io) (which we recommend), replace the npm commands below with the appropriate pnpm equivalents.

## 1. Uninstall old packages
First, uninstall the following packages by running:

```bash
npm uninstall @nuxtjs/tailwindcss radix-vue shadcn-nuxt prez-ui tailwind-merge
```

Remove `"@nuxtjs/tailwindcss"` & `"shadcn-nuxt"` from the modules array in `nuxt.config.ts`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
    ...
    modules: [
      "@nuxtjs/tailwindcss" // <- remove this line
      "shadcn-nuxt", // <- remove this line
      "@nuxtjs/color-mode",
    ],
    ...
});
```

## 2. Remove required files & folders
Delete `components.json`, `tailwind.config.js` & the `ui/` directory in `components/`.

## 3. Backup Tailwind variables
Copy the contents of `tailwind.css` into another file (e.g. `tailwind.txt`) to save your current variables, then clear the contents of `tailwind.css`.

## 4. Reinstall packages
Delete `.nuxt/`, `.output/` & `node_modules/` then run:

```bash
npm install
```

## 5. Install Tailwind 4
Run the following to install Tailwind 4:

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
## 6. Install & initialise shadcn-vue
Install the shadcn-vue Nuxt module:

```bash
npx nuxi@latest module add shadcn-nuxt
```

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

The run nuxi prepare to create the `.nuxt/` folder:

```bash
npx nuxi prepare
```

Then run the initialiser:

```bash
npx shadcn-vue@latest init
```

(When prompted for the base colour, "slate" is the default base colour for Prez UI)

Then copy the default shad components from the [template project](/packages/create-prez-app/template/components/ui/) into `components/ui/`.

## 7. Install reka-ui
If `reka-ui` is not installed by the previous command, run:

```bash
npm install reka-ui
```

## 8. Update `tailwind.css`
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

## 9. Install prez-ui
Lastly, install the latest version of Prez UI:

```bash
npm install -D prez-ui
```

As usual, check if any overridden components need to be updated from the Prez UI source code to prevent unexpected issues.
