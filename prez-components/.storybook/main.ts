import type { StorybookConfig } from "@storybook/vue3-vite";
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    previewHead: (head) => `${head}<link id="dynamic-css" rel="stylesheet" href="/default.css">`,
    //managerHead: (head) => `${head}<style>#components-button--with-text-only { display: none;}</style>`,
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "storybook-addon-vue-slots",
        // './withTheme.ts',
        // './switcher.ts',
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
    }
};
export default config;
