<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { AnnotatedObject, AnnotatedPredicate, AnnotatedQuad, ListItem, RowPred } from "@/types";
import { copyToClipboard } from "@/util/helpers";
import PropRow from "@/components/proptable/PropRow.vue";
import ToolTip from "@/components/ToolTip.vue";

const props = defineProps<{
    item: ListItem;
    properties: AnnotatedQuad[];
    blankNodes: AnnotatedQuad[];
    prefixes: {[token: string]: string};
    hiddenPreds: string[];
}>();

const rows = ref<RowPred[]>([]);

function iriToQname(iri: string): string { // doesn't require a store, uses prefixes from props
    let qname = "";
    Object.entries(props.prefixes).forEach(([prefix, prefixIri]) => {
        if (iri.startsWith(prefixIri)) {
            qname = prefix + ":" + iri.split(prefixIri)[1];
        }
    });
    return qname;
}

function qnameToIri(s: string): string { // doesn't require a store, uses prefixes from props
    if (s === "a") { // special handling for "a" as rdf:type
        return props.prefixes.rdf + "type";
    } else {
        const [prefix, pred] = s.split(":");
        return props.prefixes[prefix] + pred;
    }
}

function getAnnotation(annoNode: AnnotatedPredicate | AnnotatedObject, annotationPred: string): string | undefined {
    return annoNode.annotations.find(annotation => annotation.predicate.value === qnameToIri(annotationPred))?.object.value;
}

function copyIri() {
    navigator.clipboard.writeText(props.item.iri.trim());
}

function buildRows(properties: AnnotatedQuad[]): RowPred[] {
    let propRows: {[uri: string]: RowPred} = {};
    properties.forEach(p => {
        propRows[p.predicate.value] ??= {
            iri: p.predicate.value,
            objs: [],
            qname: iriToQname(p.predicate.value),
            label: getAnnotation(p.predicate, "rdfs:label"),
            description: getAnnotation(p.predicate, "dcterms:description"),
            explanation: getAnnotation(p.predicate, "dcterms:provenance"),
            order: 0
        };

        propRows[p.predicate.value].objs.push({
            predIri: p.predicate.value,
            value: p.object.value,
            qname: p.object.termType === "NamedNode" ? iriToQname(p.object.value) : undefined,
            datatype: p.object.termType === "Literal" ? { value: p.object.datatype!.value, qname: iriToQname(p.object.datatype!.value) } : undefined,
            language: p.object.termType === "Literal" ? p.object.language : undefined,
            termType: p.object.termType,
            label: getAnnotation(p.object, "rdfs:label"),
            description: getAnnotation(p.object, "dcterms:description"),
            explanation: getAnnotation(p.object, "dcterms:provenance"),
            rows: p.object.termType === "BlankNode" ? buildRows(props.blankNodes.filter(p1 => p1.subject.id === p.object.id)) : []
        });
    });
    return Object.values(propRows).sort((a, b) => a.order - b.order);
}

onMounted(() => {
    const properties = props.properties.filter(p => !props.hiddenPreds.includes(p.predicate.value));
    rows.value = buildRows(properties);
});
</script>

<template>
    <h1 class="page-title">
        {{ props.item.title || props.item.iri }}
        <small class="iri">
            <span class="badge">IRI</span>
            <a :href="props.item.iri" target="_blank" rel="noopener noreferrer">{{ props.item.iri }}</a>
            <button class="btn outline sm" title="Copy IRI" @click="copyToClipboard(props.item.iri)"><i class="fa-regular fa-clipboard"></i></button>
        </small>
        <small class="type">
            <span class="badge">Type</span>
            <div class="types">
                <template v-for="(typeObj, index) in props.item.types">
                    <component  :is="!!typeObj.description ? ToolTip : 'slot'">
                        <a :href="typeObj.value" target="_blank" rel="noopener noreferrer">
                            <template v-if="!!typeObj.label">{{ typeObj.label }}</template>
                            <template v-else-if="!!typeObj.qname">{{ typeObj.qname }}</template>
                            <template v-else>{{ typeObj.value }}</template>
                        </a>
                        <template #text>{{ typeObj.description }}</template>
                    </component>
                    <span v-if="index < props.item.types!.length - 1">, </span>
                </template>
            </div>
        </small>
    </h1>
    <slot name="map"></slot>
    <p v-if="!!props.item.description"><em>{{ props.item.description }}</em></p>
    <table>
        <slot name="top"></slot>
        <PropRow v-for="row in rows" v-bind="row" />
        <slot name="bottom"></slot>
    </table>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

h1.page-title {
    margin-top: 0;
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    small {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
        font-weight: normal;

        &.iri {
            font-size: 0.5em;
        }

        &.type {
            font-size: 0.45em;
        }

        .badge {
            font-size: 0.9em;
        }
    }
}

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
        background-color: var(--tableBg);
    }
}
</style>