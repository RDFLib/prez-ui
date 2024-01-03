<script lang="ts" setup>
import { RouterLink } from "vue-router";
import Chip from "primevue/chip";
import { PrezUINodeProps } from "../types";

const props = defineProps<PrezUINodeProps>();
</script>

<template>
    <div class="node">
        <component
            :is="props.links ? (props.links.length === 1 ? RouterLink : 'span') : 'a'"
            class="value"
            :href="!props.links ? props.iri : undefined"
            :to="props.links?.length === 1 ? props.links[0] : undefined"
            v-tooltip.top="props.description ? props.description.value : undefined"
        >
            <template v-if="props.label">{{ props.label.value }}</template>
            <template v-else-if="props.qname">{{ props.qname }}</template>
            <template v-else>{{ props.iri }}</template>
        </component>
        <span
            v-if="props.provenance && props.showProv"
            class="provenance"
            v-tooltip.top="props.provenance.value"
        >
            <i class="pi pi-info-circle"></i>
        </span>
        <span v-if="props.links && props.links.length > 1" class="links">
            <RouterLink v-for="link in props.links" class="link" :to="link">{{ link }}</RouterLink>
        </span>
        <a
            v-if="props.links"
            class="external-link"
            :href="props.iri"
            target="_blank"
            rel="noopener noreferrer"
            v-tooltip.top="'External link'"
        >
            <i class="pi pi-external-link"></i>
        </a>
        <span v-if="props.types && props.showType" class="types">
            <a v-for="t in props.types" class="type" :href="t.iri" target="_blank" rel="noopener noreferrer">
                <Chip
                    :label="t.label ? t.label.value : (t.qname || t.iri)"
                    v-tooltip.top="t.description ? t.description.value : undefined"
                />
            </a>
        </span>
    </div>
</template>

<style lang="scss" scoped>
.node {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;

    .links {
        display: flex;
        flex-direction: row;
        gap: 6px;
        align-items: center;

        .link {

        }
    }

    .types {
        display: flex;
        flex-direction: row;
        gap: 6px;
        align-items: center;

        .type {

        }
    }
}
</style>