<script lang="ts" setup>
import type { PrezUINodeProps } from '../types.ts';
import PrezUIDebug from './PrezUIDebug.vue';

const props = defineProps<PrezUINodeProps>();

const label = (props.term.label ? props.term.label.value :
    (props.term.curie ? props.term.curie : props.term.value));

let tooltip:string|undefined = (props.term.description ? props.term.description.value : (props.term.curie ? props.term.curie : props.term.value));
if(tooltip == label) {
    // we don't want to show a tooltip with the same info as the label
    if(label != props.term.value) {
        // if the label doesn't show the uri, then show the uri as the tooltip
        tooltip = props.term.value;
    } else {
        // we have nothing useful to show
        tooltip = undefined;
    }
}
</script>
<template>
    <WithTheme v-bind="props" component="PrezUINode" :info="props.term">
        <slot :term="props.term" :link="props.term.value" :label="label" :tooltip="tooltip">
            <a :href="props.term.value" :title="tooltip">
                {{ label }}
            </a>
        </slot>
    </WithTheme>
</template>
<style scoped>
</style>