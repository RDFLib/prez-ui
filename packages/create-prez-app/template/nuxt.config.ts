// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
    extends: [
        // ["github:jamiefeiss/prez-ui/packages/prez-ui#jamie/next/shad-layer-fix", { install: true }]
        ["prez-ui-test", { install: true }]
    ],
});
