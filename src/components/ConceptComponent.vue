<script lang="ts" setup>
import { ref, computed, watch, inject } from "vue";
import { RouterLink } from "vue-router";
import { type ConceptProps, conceptPerPageConfigKey } from "@/types";

const conceptPerPage = inject(conceptPerPageConfigKey) as number;

const props = defineProps<ConceptProps>();

const emit = defineEmits<{
    (e: "getNarrowers", obj: {
        iriPath: string;
        link: string;
        page: number;
    }): void;
}>();

const collapse = ref(true);

const iriPath = computed(() => {
    return props.parentPath === "" ? props.iri : `${props.parentPath}|${props.iri}`;
});

watch(() => props.collapseAll, (newValue, oldValue) => {
    collapse.value = newValue;
});

function toggleCollapse() {
    if (collapse.value && props.children.length === 0 && props.childrenCount > 0 && props.doNarrowerEmits) {
        emit("getNarrowers", {
            iriPath: iriPath.value,
            link: props.link,
            page: 1
        });
    }
    collapse.value = !collapse.value;
}

function loadMoreNarrowers() {
    emit("getNarrowers", {
        iriPath: iriPath.value,
        link: props.link,
        page: Math.round(props.children.length / conceptPerPage) + 1
    });
}
</script>

<template>
    <div class="concept-top">
        <button
            v-if="props.childrenCount > 0"
            class="concept-left btn outline"
            @click="toggleCollapse"
        >
            <i :class="`fa-regular fa-${collapse ? 'plus' : 'minus'}`"></i>
        </button>
        <div v-else class="concept-left"></div>
        <RouterLink class="concept" :to="props.link">{{ props.title || props.iri }}</RouterLink> <span v-if="!!props.color" :style="{color: props.color}" class="fa-solid fa-circle fa-2xs"></span>
    </div>
    <div v-if="props.childrenCount > 0" :class="`concept-children ${collapse ? 'collapse' : ''}`">
        <ConceptComponent
            v-for="concept in props.children"
            v-bind="concept"
            :baseUrl="props.baseUrl"
            :collapseAll="props.collapseAll"
            :parentPath="iriPath"
            @getNarrowers="emit('getNarrowers', $event)"
            :doNarrowerEmits="props.doNarrowerEmits"
        />
        <button
            v-if="props.children.length > 0 && props.childrenCount > props.children.length && props.doNarrowerEmits"
            class="btn outline sm"
            @click="loadMoreNarrowers"
            :style="{marginLeft: '26px'}"
        >
            Load more
        </button>
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