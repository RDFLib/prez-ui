import { defineConfig } from 'vite';
import remarkGfm from 'remark-gfm';
import vue from '@vitejs/plugin-vue';
import { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: [
//    '../app/stories/**/*.mdx',
//    '../app/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    "../../prez-components/app/stories/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../prez-components/app/stories/*.mdx",
  ],
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
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    config.plugins = config.plugins || [];
    config.plugins.push(vue());
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': '/absolute/path/to/prez-components/app/components', // Adjust this path accordingly
    };
    return config;
  },
};

export default config;
