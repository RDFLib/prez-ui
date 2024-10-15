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
            name: "PrezLib",
            fileName: (format) => `prez-lib.${format}.js`, // Define extension for UMD
            formats: ['umd'], // Specify UMD format explicitly
        },
        rollupOptions: {
            external: ['@rdfjs/types'], // Mark it as external
        }        
    },
    plugins: [
        dts({
            include: [pathToSrc + "/**/*.ts", pathToSrc + "/**/*.vue"],
            outputDir: "dist/types",
        }),
    ],    
});