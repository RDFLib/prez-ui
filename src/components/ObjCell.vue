<script setup>
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
        <template v-if="props.termType === 'NamedNode'">
            <template v-if="!!props.qname">
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
        <template v-if="!!props.language">@{{ props.language }}</template>
        <template v-else-if="!!props.datatype"> ^^
            <template v-if="!!props.datatype.qname">{{ props.datatype.qname }}</template>
            <template v-else>{{ props.datatype.value }}</template>
        </template>
    </div>
</template>

<style lang="scss" scoped>

</style>