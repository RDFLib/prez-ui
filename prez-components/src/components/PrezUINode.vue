<script lang="ts" setup>
import { RouterLink } from "vue-router";
import Chip from "primevue/chip";
import { PrezUINodeProps } from "../types";

const props = withDefaults(defineProps<PrezUINodeProps>(), {
    showType: true,
    showProv: true,
    showDesc: true,
    showExt: true,
    badge: false,
});
</script>

<template>
    <div class="node">
        <component
            :is="props.links ? (props.links.length === 1 ? RouterLink : 'span') : 'a'"
            :class="`value ${props.links?.length === 1 ? 'link' : ''}`"
            :href="!props.links ? props.value : undefined"
            :target="!props.links ? '_blank' : undefined"
            :to="props.links?.length === 1 ? props.links[0].value : undefined"
            v-tooltip.top="props.showDesc ? props.description?.value : undefined"
        >
            <component :is="props.badge ? Chip : 'slot'">
                <template v-if="props.label">{{ props.label.value }}</template>
                <template v-else-if="props.curie">{{ props.curie }}</template>
                <template v-else>{{ props.value }}</template>
            </component>
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
            v-if="props.links && props.showExt"
            class="external-link"
            :href="props.value"
            target="_blank"
            rel="noopener noreferrer"
            v-tooltip.top="'External link'"
        >
            <i class="pi pi-external-link"></i>
        </a>
        <span v-if="props.rdfTypes && props.showType" class="types">
            <PrezUINode v-for="t in props.rdfTypes" v-bind="t" badge :showProv="false" :showType="false" />
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
            a {
                color: var(--primary-color);
                cursor: pointer;
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
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