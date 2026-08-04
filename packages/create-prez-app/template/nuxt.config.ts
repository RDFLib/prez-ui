import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["shadcn-nuxt"],
    extends: ["prez-ui"],
    shadcn: {
        prefix: "",
        componentDir: "./app/components/ui"
    },
    vite: {
        plugins: [tailwindcss()],
    },
});