import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import libCss from "vite-plugin-libcss";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), libCss()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "prez-components",
            fileName: "prez-components",
        },
        rollupOptions: {
            external: ["vue", "vue-router"],
            output: {
                globals: {
                    vue: "Vue",
                },
            },
        },
    },
});
