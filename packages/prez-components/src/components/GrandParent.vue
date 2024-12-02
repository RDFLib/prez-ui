<script lang="ts" setup>
import { type Component } from "vue";
import Parent from "./Parent.vue";

const props = withDefaults(defineProps<{
    _components?: {
        parent: Component;
    }
}>(), {
    _components: () => {
        return {
            parent: Parent,
        }
    }
});
</script>

<template>
    <div>
        <div>This is the grandparent component</div>
        <component :is="props._components.parent" />
    </div>
</template>
