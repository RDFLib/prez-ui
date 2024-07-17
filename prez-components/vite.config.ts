import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import libCss from "vite-plugin-libcss";
import Components from 'unplugin-vue-components/vite';
import ViteRestart from 'vite-plugin-restart';

import fs from 'fs';
import path from 'path';

// Custom Vite Plugin for resolving aliases
const customAliasPlugin = (prefix:string, relpaths: string[]) => () => {
  return {
    name: 'custom-alias-plugin',
    resolveId(source) {
      console.log(`Checking ${source}`)
      if (source.startsWith(prefix)) {
        const moduleName = source.replace(prefix, '');
        const paths = relpaths.map(p=>path.resolve(__dirname, p, moduleName))
        for (const resolvedPath of paths) {
          try {
            if (fs.existsSync(resolvedPath)) {
              return resolvedPath; // Return the first successful path
            }
          } catch (err) {
            console.log(err);
            // Handle the error if needed
          }
        }
      }
      return null; // Not found in any of the paths
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({mode})=>{

    const theme = process.env.VITE_THEME || undefined;

    // const paths = ['src/components']
    // if(theme) {
    //     console.log(`Using theme ${theme}`)
    //     paths.push(`src/themes/${theme}`)
    // }
    const paths = ['src/test2', 'src/test'];

    return {
        plugins: [
            vue(), 
            customAliasPlugin('@x/', paths)(),
            libCss(), 
            Components({
                dirs: ['src/components'],
                extensions: ['vue'],
                deep: true,
                dts: 'src/components.d.ts'
            }),
            ViteRestart({
                restart: [
                  'src/test3/*.vue'
                ]
              })      
        ],
        resolve: {
            conditions: ['import'],
            alias: {
                '@': resolve(__dirname, "src/"),
            },
        },
        build: {
            sourcemap: true,            
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
                    sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
                        // Here you can customize the sourcemap path
                        return relativeSourcePath;
                      }                    
                },
            },
        }
    }
});
