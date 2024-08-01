import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
//import typescript from '@rollup/plugin-typescript';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import libCss from 'vite-plugin-libcss';

export default defineConfig({
  plugins: [
    vue(),
    libCss(),
    Components({
      dirs: ['app/components'],
      extensions: ['vue'],
      deep: true,
      dts: 'app/components.d.ts'
    }),
    // typescript({
    //   tsconfig: resolve(__dirname, 'tsconfig.json'),
    //   declaration: true,
    //   declarationDir: resolve(__dirname, 'dist'),
    //   rootDir: resolve(__dirname, 'app'),
    //   exclude: ['node_modules', 'dist']
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url))
    }
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'app/index.ts'),
      name: 'prez-components',
      fileName: "prez-components",
//      fileName: format => `prez-components.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue'
        },
        sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
          return relativeSourcePath;
        }
      }
    }
  }
});
