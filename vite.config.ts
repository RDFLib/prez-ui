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
    define: {
        global: {}
    },
    build: {
        target: "es2020"
    },
    optimizeDeps: {
        esbuildOptions: {
            target: "es2020"
        }
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
    // base: process.env.NODE_ENV === "production" ? "/idn-metadata-creator/" : "/",
});
