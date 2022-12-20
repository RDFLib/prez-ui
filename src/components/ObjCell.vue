<script lang="ts" setup>
const props = defineProps({
    value: String,
    qname: String,
    datatype: Object,
    language: String,
    description: String,
    termType: String,
    label: String,
    rows: Array
});
</script>

<template>
    <div>
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
        <span v-if="!!props.language" class="badge outline" title="Language">@{{ props.language }}</span>
        <a
            v-else-if="!!props.datatype"
            :href="props.datatype.value"
            target="_blank"
            rel="noopener noreferrer"
            class="badge outline"
            title="Datatype"
        >
            <span class="double-carets">
                <i class="fa-regular fa-chevron-up"></i>
                <i class="fa-regular fa-chevron-up"></i>
            </span>
            <template v-if="!!props.datatype.qname">{{ props.datatype.qname }}</template>
            <template v-else>{{ props.datatype.value }}</template>
        </a>
    </div>
</template>

<style lang="scss" scoped>
.badge {
    margin-left: 6px;
}

.double-carets {
    font-size: 0.8em;
    margin-right: 1px;
    vertical-align: text-top;
}
</style>