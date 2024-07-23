<template>
  <li>
    {{ node.componentName }}
    <ul v-if="node.children.length">
      <li v-for="(child, index) in node.children" :key="index">
        <ComponentTree :node="child" />
      </li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 20px;
}
li {
  margin: 5px 0;
}
</style>