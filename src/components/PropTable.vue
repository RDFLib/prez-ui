<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Literal, NamedNode } from "n3";
import type { AnnotatedPredicate, AnnotatedQuad, RowPred } from "@/types";
import PropRow from "@/components/PropRow.vue";

const props = defineProps<{
    properties: AnnotatedQuad[];
    prefixes: {[token: string]: string};
    hiddenPreds: string[];
}>();

const rows = ref<{[uri: string]: RowPred}>({});

function getNamedNodeQname(n: NamedNode | AnnotatedPredicate): string {
    let qname = "";
    Object.entries(props.prefixes).forEach(([prefix, prefixIri]) => {
        if (n.value.startsWith(prefixIri)) {
            qname = prefix + ":" + n.value.split(prefixIri)[1];
        }
    });
    return qname;
}

function qname(s: string): string {
    if (s === "a") { // special handling for "a" as rdf:type
        return props.prefixes.rdf + "type";
    } else {
        const [prefix, pred] = s.split(":");
        return props.prefixes[prefix] + pred;
    }
}

function getAnnotation(predicate: AnnotatedPredicate, annotationPred: string): string | undefined {
    return predicate.annotations.find(annotation => annotation.predicate.value === qname(annotationPred))?.object.value;
    // if (annotationQuad) {
    //     return annotationQuad.object.value;
    // } else {
    //     return undefined;
    // }
}

onMounted(() => {
    props.properties.filter(p => !props.hiddenPreds.includes(p.predicate.value)).forEach(p => {
        rows.value[p.predicate.value] ??= {
            iri: p.predicate.value,
            objs: [],
            qname: getNamedNodeQname(p.predicate),
            label: getAnnotation(p.predicate, "rdfs:label"),
            description: getAnnotation(p.predicate, "dcterms:description"),
            explanation: getAnnotation(p.predicate, "dcterms:provenance"),
            order: 0
        };
        rows.value[p.predicate.value].objs.push({
            value: p.object.value,
            qname: p.object instanceof NamedNode ? getNamedNodeQname(p.object) : undefined,
            datatype: p.object instanceof Literal ? { value: p.object.datatype.value, qname: getNamedNodeQname(p.object.datatype) } : undefined,
            language: p.object instanceof Literal ? p.object.language : undefined,
            description: undefined,
            termType: p.object.termType,
            label: undefined,
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
            vertical-align: top;
        }
    }

    & > :deep(tr:nth-child(2n + 1)) {
        background-color: $tableBg;
    }
}
</style>