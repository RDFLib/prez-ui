import { fileURLToPath } from "url";
import { dirname, join } from "path";

const currentDir = dirname(fileURLToPath(import.meta.url));

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxtjs/color-mode"],
    css: [
        "prez-components/style.css",
        "./assets/css/tailwind.css",
        join(currentDir, "./assets/css/style.css"),
        "./assets/css/theme.css"
    ],
    ssr: false,
    runtimeConfig: {
        public: {
            prezApiEndpoint: "http://localhost:8000",
            prezApiEndpointAlt: "",
            prezApiEndpointAltNames: "",
            prezUtilsTestPath: "/catalogs/ns:catId/collections/ns:colId/items/ns:itemId",
            prezDebug: false,
            prezAllowApiEndpointChange: false,
            prezAutoDetectMarkdown: false,
            prezAutoDetectHtml: false
        }
    },
    nitro: {
        esbuild: {
            options: {
                target: 'es2020'
            }
        }
    },
});