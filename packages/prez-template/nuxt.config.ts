// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss"],
    extends: [
        // "../prez-ui",
        ["github:rdflib/prez-ui/prez-ui#jamie/next/shad-layer-fix", { install: true }]
    ],
});