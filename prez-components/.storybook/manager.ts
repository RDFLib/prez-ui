import { addons } from '@storybook/manager-api';
//import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

const theme = create({
  base: 'dark',
  brandTitle: 'Prez Components',
});

addons.setConfig({
  theme
});
