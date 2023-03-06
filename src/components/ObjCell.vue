<script lang="ts" setup>
import type { RowObj } from "@/types";

const props = defineProps<RowObj>();
</script>

<template>
    <div class="prop-obj">
        <div class="obj-value">
            <template v-if="props.termType === 'BlankNode'">
                blank node
            </template>
            <template v-else-if="props.termType === 'NamedNode'">
                <template v-if="!!props.label">
                    <a :href="props.value" target="_blank" rel="noopener noreferrer">{{ props.label }}</a>
                </template>
                <template v-else-if="!!props.qname">
                    <a :href="props.value" target="_blank" rel="noopener noreferrer">{{ props.qname }}</a>
                </template>
                <template v-else>
                    <a :href="props.value" target="_blank" rel="noopener noreferrer">{{ props.value }}</a>
                </template>
            </template>
            <template v-else>
                <template v-if="props.value.startsWith('http')">
                    <a :href="props.value" target="_blank" rel="noopener noreferrer">{{ props.value }}</a>
                </template>
                <template v-else>{{ props.value }}</template>
            </template>
        </div>
        <div class="obj-tag">
            <span v-if="!!props.language" class="badge outline" title="Language">{{ props.language }}</span>
            <a
                v-else-if="!!props.datatype"
                :href="props.datatype.value"
                target="_blank"
                rel="noopener noreferrer"
                class="badge outline"
                title="Datatype"
            >
                <template v-if="!!props.datatype.qname">{{ props.datatype.qname }}</template>
                <template v-else>{{ props.datatype.value }}</template>
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.prop-obj {
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    justify-content: space-between;
}

.badge {
    margin-left: 6px;
}
</style>