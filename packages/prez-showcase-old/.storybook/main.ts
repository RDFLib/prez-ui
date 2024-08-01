import type { StorybookConfig } from "@storybook/vue3-vite";
import remarkGfm from 'remark-gfm';
import { mergeConfig } from "vite";
import path from 'path';

const config: StorybookConfig = {
    stories: [//"../app/**/*.mdx", "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)", 
      "../../prez-components/app/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    
//    previewHead: (head) => `${head}<link id="dynamic-css" rel="stylesheet" href="/default.css">`,
    //managerHead: (head) => `${head}<style>#components-button--with-text-only { display: none;}</style>`,
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "storybook-addon-vue-slots",
        "@chromatic-com/storybook",
        {
            name: '@storybook/addon-docs',
            options: {
              mdxPluginOptions: {
                mdxCompileOptions: {
                  remarkPlugins: [remarkGfm],
                },
              },
            },
        },        
    ],
    framework: {
        name: "@storybook/vue3-vite",
        options: {},
    },
    core: {
        builder: '@storybook/builder-vite'
    },    
    docs: {
      autodocs: true
    },
    async viteFinal(config, { configType }) {
      // Customize the Vite config here
      return mergeConfig(config, {
          resolve: {
              alias: {
                  '@prez-components': path.resolve(__dirname, '../packages/prez-components/app/components')
              }
          },
          define: {
            '__VUE_OPTIONS_API__': JSON.stringify(true),
            '__VUE_PROD_DEVTOOLS__': JSON.stringify(false),
            '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false)
          },          
          build: {
              sourcemap: true // Ensure sourcemaps are generated
          }
      });
  },
};
export default config;
