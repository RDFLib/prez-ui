<script lang="ts" setup>
import { type Component } from "vue";
import Child from "./Child.vue";

const props = withDefaults(defineProps<{
    _components?: {
        child: Component;
    }
}>(), {
    _components: () => {
        return {
            child: Child,
        }
    }
});
</script>

<template>
    <div>
        <div>This is the parent component</div>
        <component :is="props._components.child" />
    </div>
</template>
