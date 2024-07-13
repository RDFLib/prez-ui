<template>
    <template v-if="loaded">
      <component v-if="useTheme && dynamicComponent" :is="dynamicComponent" v-bind="$attrs">
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
const theme = ref<string>(props.theme || getTheme());

//const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to load component based on theme
const loadComponent = async (theme: string) => {
  if (theme === 'default') {
    themeChecked.value = true;
    useTheme.value = false;
    return null;
  }
  try {
    // Load component from the specified theme directory
    const component = await import(`@/themes/${theme}/${componentName.value}.vue`);
//    await delay(2000);
    themeChecked.value = true;
    useTheme.value = true;
    return component.default || component;
  } catch (error) {
//    console.warn(`Themed component '${componentName.value}' not found for theme '${theme}', falling back to slot content.`);
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
