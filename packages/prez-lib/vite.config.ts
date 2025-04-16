import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [dts({
        insertTypesEntry: true,
    })],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "PrezLib",
            formats: ["es", "umd"],
            fileName: (format) => `prez-lib.${format === 'umd' ? 'umd.cjs' : 'js'}`,
        },
        sourcemap: true,
        minify: false,
        rollupOptions: {
            external: ["n3"],
            output: {
                globals: {
                    n3: "N3",
                },
            },
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
});
