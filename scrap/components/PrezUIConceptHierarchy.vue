<script lang="ts" setup>
import type { Concept } from "prez-lib";
import PrezUIConcept from "./PrezUIConcept.vue";

const props = defineProps<{
    concepts: Concept[];
}>();
</script>

<template>
    <div class="concepts">
        <PrezUIConcept v-for="concept in props.concepts" v-bind="concept" />
    </div>
</template>

<style lang="scss" scoped>
.concepts {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>