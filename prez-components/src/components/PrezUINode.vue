<script lang="ts" setup>
import type { PrezUINodeProps } from '../types';
import Chip from "primevue/chip";

const props = defineProps<PrezUINodeProps>();

const label = (props.term.label ? props.term.label.text :
    (props.term.curie ? props.term.curie : props.term.uri));

let tooltip = (props.term.description ? props.term.description.text : (props.term.curie ? props.term.curie : props.term.uri));
if(tooltip == label) {
    // we don't want to show a tooltip with the same info as the label
    if(label != props.term.uri) {
        // if the label doesn't show the uri, then show the uri as the tooltip
        tooltip = props.term.uri;
    } else {
        // we have nonthing useful to show
        tooltip = undefined;
    }
}
</script>
<template>
    <a v-if="props.size == 'small'" :href="props.term.uri">
        <Chip v-tooltip.bottom="tooltip" :label="label" />
    </a>
    <a v-else :href="props.term.uri" v-tooltip="tooltip">
        {{ label }}
    </a>
</template>
<style scoped>
.p-chip {
    float:right;
}
</style>