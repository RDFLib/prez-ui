import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    define: {
        global: {},
        "__APP_VERSION__": JSON.stringify(process.env.npm_package_version),
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
    }
});
