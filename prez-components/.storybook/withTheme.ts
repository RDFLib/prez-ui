// withTheme.ts

import { ref, onMounted, onUnmounted, h } from 'vue';
import { addons } from '@storybook/manager-api';
import { setTheme, getTheme } from '../src/themeManager';

const channel = addons.getChannel();


export const withTheme = (storyFn, context) => {
  const theme = ref(getTheme());

  const handleChange = (newTheme) => {
    setTheme(newTheme);
    channel.emit('theme-switcher/change', newTheme);
    window.location.reload();
  };

  onMounted(() => {
    channel.on('theme-switcher/change', handleChange);
  });

  onUnmounted(() => {
    channel.off('theme-switcher/change', handleChange);
  });

  return () => {
    return h('div', { class: theme.value }, storyFn(context));
  };
};
