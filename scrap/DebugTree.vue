<template>
    <div class="debug-wrapper">
      <div class="debug-info">
        <h3>Component Tree</h3>
        <ul>
          <ComponentTree v-if="componentTree.children.length > 0" :node="componentTree.children[0]" />
        </ul>
      </div>
      <slot></slot>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { reactive, onMounted, getCurrentInstance } from 'vue';
  import ComponentTree from './ComponentTree.vue';
  
  function analyzeVNode(vnode) {
  let componentName = vnode.type && vnode.type.__name;
  
  if (!componentName && vnode.type) {
    if (typeof vnode.type === 'string') {
      componentName = vnode.type;
    } else if (vnode.type.__vccOpts) {
      componentName = vnode.type.__vccOpts.name || 'Anonymous Component';
    }
  }

  const children = [];

  if (vnode.children && typeof vnode.children === 'object') {
    // Handle object structure (named slots)
    Object.keys(vnode.children).forEach(key => {
      const child = vnode.children[key];
      if (Array.isArray(child)) {
        child.forEach(c => {
          if (typeof c === 'object') {
            children.push(analyzeVNode(c));
          }
        });
      } else if (typeof child === 'object') {
        children.push(analyzeVNode(child));
      } else if (typeof child === 'function') {
        // Handle function placeholder in named slots
        children.push({
          componentName: (child()?.[0]?.ctx?.type?.__name) || 'Function Slot',
          children: [],
        });
      } else if (false && typeof child === 'number') {
        // Handle number placeholder in named slots
        children.push({
          componentName: 'Number Slot',
          children: [],
        });
      }
    });
  } else if (Array.isArray(vnode.children)) {
    // Handle array structure (default slot)
    vnode.children.forEach(child => {
      if (typeof child === 'object') {
        children.push(analyzeVNode(child));
      }
    });
  } else if (vnode.component && vnode.component.subTree) {
    // Handle component subtree
    children.push(analyzeVNode(vnode.component.subTree));
  }

  return {
    componentName: componentName || (vnode.child && vnode.child()[0].ctx.type.__name) || 'Anonymous Component',
    children,
  };
}


  
  const instance = getCurrentInstance();
  const componentTree = reactive({
    componentName: '',
    children: [],
  });
  
  onMounted(() => {
    if (instance) {
      const slotContent = instance.slots.default?.() || [];
      componentTree.componentName = instance.type.__name || 'Anonymous Component';
      componentTree.children = slotContent.map(analyzeVNode);
    }
  });
  </script>
  
  <style scoped>
  .debug-wrapper {
    border: 1px dashed #333;
    padding: 10px;
    margin: 10px 0;
  }
  .debug-info {
    background: #f9f9f9;
    padding: 5px;
    margin-bottom: 10px;
  }
  </style>
  