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
            :class="`value ${props.links?.length === 1 ? 'link' : ''}`"
            :href="!props.links ? props.value : undefined"
            :to="props.links?.length === 1 ? props.links[0].value : undefined"
            v-tooltip.top="props.description?.value || undefined"
        >
            <template v-if="props.label">{{ props.label.value }}</template>
            <template v-else-if="props.curie">{{ props.curie }}</template>
            <template v-else>{{ props.value }}</template>
        </component>
        <span
            v-if="props.provenance && props.showProv"
            class="provenance"
            v-tooltip.top="props.provenance.value"
        >
            <i class="pi pi-info-circle"></i>
        </span>
        <span v-if="props.links && props.links.length > 1" class="links">
            <RouterLink v-for="link in props.links" class="link" :to="link.value">{{ link.value }}</RouterLink>
        </span>
        <a
            v-if="props.links"
            class="external-link"
            :href="props.value"
            target="_blank"
            rel="noopener noreferrer"
            v-tooltip.top="'External link'"
        >
            <i class="pi pi-external-link"></i>
        </a>
        <span v-if="props.rdfTypes && props.showType" class="types">
            <a v-for="t in props.rdfTypes" class="type" :href="t.value" target="_blank" rel="noopener noreferrer">
                <Chip
                    :label="t.label?.value || (t.curie || t.value)"
                    v-tooltip.top="t.description?.value || undefined"
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

    .value {
        &.link {
            color: #8c8cff;
            text-decoration: underline;
            cursor: pointer;
        }
    }

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