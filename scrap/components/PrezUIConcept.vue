<script lang="ts" setup>
import { ref } from "vue";
import Button from "primevue/button";
import type { PrezUIConceptProps } from "../types";
import PrezUINode from "./PrezUINode.vue";

const props = defineProps<PrezUIConceptProps>();

const open = ref(false);

function toggleOpen() {
    open.value = !open.value;
}
</script>

<template>
    <div class="concept">
        <div class="concept-content">
            <PrezUINode v-bind="props" />
            <Button v-if="props.narrowers.length > 0" size="small" outlined :icon="`pi pi-chevron-${open ? 'up' : 'down'}`" @click="toggleOpen" />
        </div>
        <div v-if="props.narrowers.length > 0" :class="`narrowers ${open ? '' : 'collapse'}`">
            <PrezUIConcept v-for="narrower in props.narrowers" v-bind="narrower" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.concept {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .concept-content {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .narrowers {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-left: 12px;
        border-left: 1px solid #c6c6c6;
        overflow-y: hidden;

        &.collapse {
            height: 0;
        }
    }
}
</style>