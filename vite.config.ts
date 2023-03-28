import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueTypeImports from "vite-plugin-vue-type-imports";


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), VueTypeImports(),],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    build: {
        target: "es2020",
        rollupOptions: {
            external: ["google.maps"]
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            target: "es2020",
        },
        include: [
            "@fawmi/vue-google-maps",
            "fast-deep-equal",
        ]
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @import "@/assets/sass/variables.scss";
                    @import "@/assets/sass/mixins.scss";
                    @import "@/assets/sass/transitions.scss";
                `
            }
        }
    },
    base: process.env.GH_PAGES_DEMO ? "/prez-ui/" : "/",
});
