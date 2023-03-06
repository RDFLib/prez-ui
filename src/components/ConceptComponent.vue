<script lang="ts" setup>
import { ref, watch } from "vue";
import { RouterLink } from "vue-router";
import type { ConceptProps } from "@/types";

const props = defineProps<ConceptProps>();

const collapse = ref(true);

watch(() => props.collapseAll, (newValue, oldValue) => {
    collapse.value = newValue;
});
</script>

<template>
    <div class="concept-top">
        <button v-if="props.children" class="concept-left btn outline" @click="collapse = !collapse"><i :class="`fa-regular fa-${collapse ? 'plus' : 'minus'}`"></i></button>
        <div v-else class="concept-left"></div>
        <RouterLink class="concept" :to="props.link">{{ props.title || props.iri }}</RouterLink>
    </div>
    <div v-if="props.children" :class="`concept-children ${collapse ? 'collapse' : ''}`">
        <ConceptComponent v-for="concept in props.children" v-bind="concept" :baseUrl="props.baseUrl" :collapseAll="props.collapseAll" />
    </div>
</template>

<style lang="scss" scoped>
$gap: 6px;
$width: 20px;

.concept-top {
    display: flex;
    flex-direction: row;
    gap: $gap;
    align-items: center;

    .concept-left {
        width: $width;

        &.btn {
            padding: 2px 4px;
        }
    }
}

.concept-children {
    margin-left: $gap + $width;
    overflow: hidden;

    &.collapse {
        height: 0;
    }
}
</style>