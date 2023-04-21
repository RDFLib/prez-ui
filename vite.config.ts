import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import VueTypeImports from "vite-plugin-vue-type-imports";
import pluginRewriteAll from "vite-plugin-rewrite-all";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    return {
        plugins: [vue(), VueTypeImports(), pluginRewriteAll(),],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url))
            }
        },
        build: {
            target: "es2020",
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
        base: process.env.GH_PAGES_DEMO ? "/prez-ui/" : (process.env.VITE_BASE_URL || "/"),
    };
});