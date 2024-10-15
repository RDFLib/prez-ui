<script setup lang="ts">
/** 
 * Render a PrezNodeList list of nodes recursively
 */
import type { PrezNodeList } from '@/base/lib';

interface Props {
    list: PrezNodeList[];
    level?: number;
    maxLevels?: number;
}
const props = withDefaults(defineProps<Props>(), {level: 0, maxLevels: 20});
</script>
<template>
    <!-- NodeList -->
    <div v-if="level < maxLevels || maxLevels == 0" v-for="item of props.list">
        <Node :term="item.node" />
        <div class="pl-2" v-if="item.list">
            <NodeList :list="item.list" :level="props.level+1" />
        </div>
    </div>
</template>
