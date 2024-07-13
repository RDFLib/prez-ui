<script lang="ts" setup>
import type { PrezUINodeProps } from '@/types.ts';
import { PrezNode } from 'prez-lib';

const props = defineProps<PrezUINodeProps>();

const term = props.term as PrezNode;

const label = (term.label ? term.label.value :
    (term.curie ? term.curie : term.value));

let tooltip:string|undefined = (term.description ? term.description.value : (term.curie ? term.curie : term.value));
if(tooltip == label) {
    // we don't want to show a tooltip with the same info as the label
    if(label != term.value) {
        // if the label doesn't show the uri, then show the uri as the tooltip
        tooltip = term.value;
    } else {
        // we have nothing useful to show
        tooltip = undefined;
    }
}
</script>
<template>
    <WithTheme v-bind="props" component="PrezUINode" :info="props.term">
        <slot :term="term" :link="term.value" :label="label" :tooltip="tooltip">
            <div class="prezui-node">
                <a :href="term.value" :title="tooltip">
                    {{ label }}
                </a>
            </div>
        </slot>
    </WithTheme>
</template>
<style scoped>
</style>