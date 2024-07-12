import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import libCss from "vite-plugin-libcss";
import Components from 'unplugin-vue-components/vite';


// https://vitejs.dev/config/
export default defineConfig(({mode})=>{
    // let themeDir = resolve(__dirname, 'src/components');

    // if (mode === 'primevue') {
    //     themeDir = resolve(__dirname, 'src/themes/primevue/components');
    // }

    return {
        plugins: [
            vue(), 
            libCss(), 
            Components({
                dirs: ['src/components'],
                extensions: ['vue'],
                deep: true,
                dts: 'src/components.d.ts'
            })
        ],
        resolve: {
            conditions: ['import'],
            alias: [
//                {find: "@/themes", replacement: resolve(__dirname, "src/themes")},
                {find: "@", replacement: resolve(__dirname, "src/")},
            ],
            // alias: [
            //     // {
            //     //   find: '@/(.*)$',
            //     //   replacement: '/src/themes/primevue/$1',
            //     // },
            //     {
            //       find: '@/(.*)$',
            //       replacement: fileURLToPath(new URL('./src/', import.meta.url)) + '$1',
            //     },
            //   ],       
        },
            // alias: {
            //     "@theme": resolve(__dirname, "src/themes/primevue"),
            //     "@": resolve(__dirname, "src")//fileURLToPath(new URL("./src", import.meta.url))
            // }
        // },
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
        }
    }
});
