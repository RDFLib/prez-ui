<template>
    <template v-if="loaded">
      <component v-if="!props.notheme && useTheme && dynamicComponent" :is="dynamicComponent" v-bind="$attrs">
        <slot></slot>
      </component>
      <PrezUIDebug v-else :debug="props.debug" :title="props.component" :info="props.info || {}">
        <slot></slot>
      </PrezUIDebug>
    </template>
</template>

<script setup lang="ts">
import { defineAsyncComponent, defineProps, ref, computed, watch, onMounted } from 'vue';
import { getTheme } from '../settingsManager';
import PrezUIDebug from './PrezUIDebug.vue';

// Define props
const props = defineProps<{
  component: string;
  notheme?: boolean;
  theme?: string;
  debug?: boolean;
  info?: any;
  [additional:string]: any;
}>();

const loaded = ref(false);
const themeChecked = ref(false);
const useTheme = ref(false);

// Define component ref
const componentName = ref<string>(props.component);
const theme = ref<string>(props.theme || getTheme() || 'default');

//const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to load component based on theme
const loadComponent = async (theme: string) => {

//  console.log("LOADING ABC")
//  TestABC.value = await import('./testABC.vue');

  if (theme === 'default' || props.notheme) {
    console.log(`${theme} - not loading theme for ${componentName}`)
    themeChecked.value = true;
    useTheme.value = false;
    return null;
  }
  console.log(`${theme} - loading theme for ${componentName.value}`)
  try {
    // Load component from the specified theme directory
//    console.log('DIR=', __dirname)
    const component = await import(`../themes/${theme}/${componentName.value}.vue`);
//    await delay(2000);
    themeChecked.value = true;
    useTheme.value = true;
    return component.default || component;
  } catch (error) {
    console.log(error);
    console.warn(`Unable to load themed component '${componentName.value}' for theme '${theme}', falling back to slot content.`);
    themeChecked.value = true;
    useTheme.value = false;
    return null;
  }
};

// Computed property to dynamically import component based on props
const dynamicComponent = computed(() => {
  if (!componentName.value) {
    themeChecked.value = true;
    return null; // Handle case where componentName is not set
  }

  // Define async component based on current theme
  return defineAsyncComponent(() => loadComponent(theme.value));
});

// Watch for changes in props.component and update componentName
watch(() => props.component, (newValue) => {
  componentName.value = newValue;
});

// Ensure theme check is performed on mount
onMounted(async () => {
  if(props.notheme) {
    loaded.value = true;
    return;
  }
  try {
    if (theme.value !== 'default') {
      await loadComponent(theme.value);
    } else {
      themeChecked.value = true;
    }
  } catch (ex) {
    console.log((ex as Error).message)
  }
  console.log(componentName.value)
  loaded.value = true;
});
</script>
