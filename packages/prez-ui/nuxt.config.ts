import { fileURLToPath } from "url";
import { dirname, join } from "path";
import tailwindcss from "@tailwindcss/vite";
import pkg from "./package.json";

const currentDir = dirname(fileURLToPath(import.meta.url));

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@nuxtjs/color-mode", "shadcn-nuxt"],
    css: [
        "prez-components/prez-components.css",
        "@/assets/css/tailwind.css",
        join(currentDir, "app/assets/css/style.css"),
        "@/assets/css/theme.css"
    ],
    shadcn: {
        prefix: "",
        componentDir: "@/components/ui"
    },
    ssr: false,
    runtimeConfig: {
        app: {
            version: pkg.version,
        },
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
    vite: {
        plugins: [tailwindcss()],
    },
    nitro: {
        esbuild: {
            options: {
                target: "es2020"
            }
        }
    },
});