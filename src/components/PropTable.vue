<script lang="ts" setup>
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

function qname(s) {
    if (s === "a") { // special handling for "a" as rdf:type
        return props.prefixes.rdf + "type";
    } else {
        const [prefix, pred] = s.split(":");
        return props.prefixes[prefix] + pred;
    }
}

function getAnnotation(predicate, annotationPred) {
    const annotationQuad = predicate.annotations.find(annotation => annotation.predicate.value === qname(annotationPred));
    if (annotationQuad) {
        return annotationQuad.object.value;
    } else {
        return null;
    }
}

onMounted(() => {
    props.properties.filter(p => !props.hiddenPreds.includes(p.predicate.value)).forEach(p => {
        rows.value[p.predicate.value] ??= {
            iri: p.predicate.id,
            objs: [],
            qname: getNamedNodeQname(p.predicate),
            label: getAnnotation(p.predicate, "rdfs:label"),
            description: getAnnotation(p.predicate, "dcterms:description"),
            explanation: getAnnotation(p.predicate, "dcterms:provenance"),
            order: 0
        };
        rows.value[p.predicate.value].objs.push({
            value: p.object.value,
            qname: getNamedNodeQname(p.object),
            datatype: p.object.datatype ? { value: p.object.datatype.value, qname: getNamedNodeQname(p.object.datatype) } : null,
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