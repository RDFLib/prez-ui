import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), dts()],
    css: {
        postcss: {
            plugins: [tailwind(), autoprefixer()],
        },
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
                inlineDynamicImports: true, // turn off chunking
            },
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
});
