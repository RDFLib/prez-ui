// packages/core/builds/lib/vite.config.js

import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";

// Vite configuration for building a library
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "../../app/lib/index.ts"),
      name: "PrezUILib",
      fileName: (format) => `prez-lib.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      // Exclude dependencies from the bundle
      external: ["vue"], // Example of marking Vue as external
      output: {
        globals: {
          vue: "Vue", // Global variable name for Vue in UMD builds
        },
      },
    },
  },
});
