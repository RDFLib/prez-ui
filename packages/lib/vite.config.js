import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";
import dts from "vite-plugin-dts";

const pathToSrc = '../core/app/base/lib';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": fileURLToPath(new URL(pathToSrc, import.meta.url))
        }
    },
    build: {
        lib: {
            entry: resolve(__dirname, pathToSrc + "/index.ts"),
            name: "prez-lib",
            fileName: "prez-lib",
        },
    },
    plugins: [
        dts({
            include: [pathToSrc + "/**/*.ts", pathToSrc + "/**/*.vue"],
            outputDir: "dist/types",
        }),
    ],    
});