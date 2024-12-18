<script lang="ts" setup>
import type { PrezNode } from 'prez-lib-test';
import { ItemHeaderProps } from "@/types";
import Node from "./Node.vue";
import Literal from "./Literal.vue";

const props = withDefaults(defineProps<ItemHeaderProps>(), {
    _components: () => {
        return {
            node: Node,
            literal: Literal,
        }
    }
});
const term = props.term as PrezNode;
</script>

<template>
    <!-- ItemHeader -->
    <div class="prezui-header">
        <div class="prezui-header-title">
            <component :is="props._components.node" :term="term" variant="item-header" />
        </div>
        <div v-if="term.description" class="text-base">
            <component :is="props._components.literal" :term="term.description" variant="item-header" />
        </div>
    </div>
</template>

<style scoped>
.prezui-header-title {
    font-size: x-large;
}
</style>