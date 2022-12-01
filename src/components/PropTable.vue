<script setup>
import { ref, onMounted } from "vue";
import PropRow from "@/components/PropRow.vue";

const props = defineProps({
    properties: Array,
    prefixes: Object,
    hiddenPreds: Array
});

const rows = ref({});

function getNamedNodeQname(n) {
    let qname = "";
    Object.entries(props.prefixes).forEach(([prefix, prefixIri]) => {
        if (n.value.startsWith(prefixIri)) {
            qname = prefix + ":" + n.value.split(prefixIri)[1];
        }
    });
    return qname;
}

onMounted(() => {
    props.properties.filter(p => !props.hiddenPreds.includes(p.predicate.value)).forEach(p => {
        rows.value[p.predicate.value] ??= {
            iri: p.predicate.id,
            objs: [],
            qname: getNamedNodeQname(p.predicate),
            label: null,
            description: null,
            explanation: null,
            order: 0
        };
        rows.value[p.predicate.value].objs.push({
            value: p.object.value,
            qname: getNamedNodeQname(p.object),
            datatype: p.object.datatype ? {value: p.object.datatype.value, qname: getNamedNodeQname(p.object.datatype)} : null,
            language: p.object.language,
            description: null,
            termType: p.object.termType,
            label: null,
            rows: []
        });
    });
});
</script>

<template>
    <table>
        <slot name="top"></slot>
        <!-- <tr v-for="property in props.properties">
            <th>
                <ToolTip>
                    <a :href="property.predicate.value" target="_blank" rel="noopener noreferrer">
                        {{ getNamedNodeQname(property.predicate) }}
                    </a>
                    <template #text>some text</template>
                </ToolTip>
            </th>
            <td>
                <template v-if="property.object.termType === 'NamedNode'">
                    <template v-if="!!getNamedNodeQname(property.object)">
                        <a :href="property.object.value" target="_blank" rel="noopener noreferrer">{{ getNamedNodeQname(property.object) }}</a>
                    </template>
                    <template v-else>
                        <a :href="property.object.value" target="_blank" rel="noopener noreferrer">{{ property.object.value }}</a>
                    </template>
                </template>
                <template v-else>
                    <template v-if="property.object.value.startsWith('http')">
                        <a :href="property.object.value" target="_blank" rel="noopener noreferrer">{{ property.object.value }}</a>
                    </template>
                    <template v-else>{{ property.object.value }}</template>
                </template>
                <template v-if="!!property.object.language">@{{ property.object.language }}</template>
                <template v-else-if="!!property.object.datatype"> ^^{{ getNamedNodeQname(property.object.datatype) }}</template>
            </td>
        </tr> -->
        <PropRow v-for="row in Object.values(rows).sort((a, b) => a.order - b.order)" v-bind="row" />
        <slot name="bottom"></slot>
    </table>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

table {
    border-collapse: collapse;

    :deep(tr) {

        th, td {
            padding: 6px;
        }

        th {
            text-align: left;
        }
    }

    & > :deep(tr:nth-child(2n + 1)) {
        background-color: $tableBg;
    }
}
</style>