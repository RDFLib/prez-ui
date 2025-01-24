<script setup lang="ts">
/** 
 * Render a PrezNodeList list of nodes recursively
 */
import { NodeListProps } from "@/types";
import Node from "./Node.vue";

const props = withDefaults(defineProps<NodeListProps>(), {
    level: 0,
    maxLevels: 20,
    _components: () => {
        return {
            node: Node,
        }
    }
});
</script>

<template>
    <!-- NodeList -->
    <div v-if="level < maxLevels || maxLevels == 0" v-for="item of props.list">
        <component :is="props._components.node" :term="item.node" />
        <div class="pl-2" v-if="item.list">
            <NodeList :list="item.list" :level="props.level+1" />
        </div>
    </div>
</template>
