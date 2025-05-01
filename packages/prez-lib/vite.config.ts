import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "prez-lib",
            fileName: "prez-lib",
        }
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
});