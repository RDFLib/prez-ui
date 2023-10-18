<script lang="ts" setup>
import ToolTip from "@/components/ToolTip.vue";
import type { PropTablePredicate } from "@/types";

const props = defineProps<PropTablePredicate>();
</script>

<template>
    <th>
        <component :is="!!props.description ? ToolTip : 'slot'">
            <a :href="props.iri" target="_blank" rel="noopener noreferrer">
                <template v-if="!!props.label">{{ props.label }}</template>
                <template v-else-if="!!props.qname">{{ props.qname }}</template>
                <template v-else>{{ props.iri }}</template>
            </a>
            <template #text>{{ props.description }}</template>
        </component>
    </th>
</template>

<style lang="scss" scoped>

</style>