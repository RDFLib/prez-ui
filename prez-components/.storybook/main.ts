import type { StorybookConfig } from "@storybook/vue3-vite";
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    //previewHead: (head) => `${head}<link id="dynamic-css" rel="stylesheet" href="/globals.css">`,
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
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
        builder: '@storybook/builder-vite',
    },    
//    docs: {},
};
export default config;
