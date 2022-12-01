<script setup>
import ToolTip from "@/components/ToolTip.vue";

const props = defineProps({
    iri: String,
    qname: String,
    label: String,
    description: String,
    explanation: String,
});
</script>

<template>
    <th>
        <component :is="!!props.description ? ToolTip : 'slot'">
            <a :href="props.iri" target="_blank" rel="noopener noreferrer">
                <template v-if="!!props.label">{{ props.label }}</template>
                <template v-else>{{ props.qname }}</template>
            </a>
            <template #text>{{ props.description }}</template>
        </component>
    </th>
</template>

<style lang="scss" scoped>

</style>