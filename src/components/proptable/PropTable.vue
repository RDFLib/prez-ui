<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { AnnotatedTriple, ListItem, Prefixes, PropTableRow } from "@/types";
import { copyToClipboard } from "@/util/helpers";
import PropRow from "@/components/proptable/PropRow.vue";
import ToolTip from "@/components/ToolTip.vue";

const props = defineProps<{
    item: ListItem;
    properties: AnnotatedTriple[];
    blankNodes: AnnotatedTriple[];
    prefixes: Prefixes;
    hiddenPredicates: string[];
}>();

const rows = ref<PropTableRow[]>([]);

function buildRows(properties: AnnotatedTriple[]): PropTableRow[] {
    let propRows: {[uri: string]: PropTableRow} = {};
    properties.forEach(p => {
        const { value, ...pred } = p.predicate; // omit & rename "value" to "iri"
        propRows[p.predicate.value] ??= {
            iri: p.predicate.value,
            ...pred,
            order: 0,
            objects: [],
        };

        propRows[p.predicate.value].objects.push({
            ...p.object,
            predicateIri: p.predicate.value,
            rows: p.object.termType === "BlankNode" ? buildRows(props.blankNodes.filter(p1 => p1.subject.id === p.object.id)) : []
        });
    });
    return Object.values(propRows).sort((a, b) => a.order - b.order);
}

onMounted(() => {
    const properties = props.properties.filter(p => !props.hiddenPredicates.includes(p.predicate.value));
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