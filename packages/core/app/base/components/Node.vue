<script lang="ts" setup>
import type { PrezNode } from '@/base/lib';

interface Props {
    term: PrezNode;
    hideTooltip?: boolean;
    hideLink?: boolean;
    useExternalLinkOnly?: boolean;
    textOnly?: boolean;
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
}

const props = defineProps<Props>();

let hideTooltip = props.hideTooltip || false;
let textOnly = props.textOnly || false;
let hideLink = props.hideLink || false;
let useExternalLinkOnly = props.useExternalLinkOnly || false;

switch(props.variant) {
    case 'item-table':
        break;
    case 'item-list':
        //useExternalLinkOnly = true;
        break;
    case 'item-header':
        hideLink = true;
        break;
    case 'search-results':
        break;
    default:
        break;
}

const term = props.term as PrezNode;

const label = (term.label?.value ? term.label.value :
    (term.curie ? term.curie : term.value));

let tooltip:string|undefined = term.description?.value || term.curie || term.value;

if(tooltip == label) {
    // we don't want to show a tooltip with the same info as the label
    if(label != term.value) {
        // if the label doesn't show the uri, then show the uri as the tooltip
        tooltip = term.value;
    } else {
        // we have nothing useful to show, e.g. don't want to show the same tooltip as label
        tooltip = undefined;
    }
}

</script>
<template>
    <!-- Node -->
    <slot name="wrapper" :term="term" :link="term.value" :label="label" :tooltip="tooltip" :variant="variant">
        <slot v-if="textOnly || hideLink" :term="term" :link="term.value" :label="label" :tooltip="tooltip">
                {{ label }}
        </slot>
        <ItemLink v-else :to="useExternalLinkOnly ? term.value : term" :title="hideTooltip ? undefined : tooltip" :variant="variant">
            <slot :term="term" :link="term.value" :label="label" :tooltip="tooltip">
                {{ label }}
            </slot>
        </ItemLink>
    </slot>
</template>
