<script lang="ts" setup>
import type { PrezUINodeProps } from '../types.ts';
import { type PrezNode } from 'prez-lib';
import PrezUILink from './PrezUILink.vue';

const props = defineProps<PrezUINodeProps>();

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
    <slot name="wrapper" :term="term" :link="term.value" :label="label" :tooltip="tooltip">
        <PrezUILink :to="variant == 'list-header' ? term : term.value" :title="tooltip">
            <slot :term="term" :link="term.value" :label="label" :tooltip="tooltip">
                {{ label }}
            </slot>
        </PrezUILink>
    </slot>
</template>
