<script lang="ts" setup>
import { type PrezItemPage, PrezUINode, CopyButton } from "prez-components";
import type { ProfileHeader } from "prez-lib";
import PrezUIObjectTable from "./PrezUIObjectTable.vue";

const props = defineProps<PrezItemPage & {
    path: string;
    profiles: ProfileHeader[];
}>();
</script>

<template>
    <main>
        <div class="item-header">
            <h1>{{ props.focusNode.label?.value || props.focusNode.value }}</h1>
            <div class="flex-row">Type: <div class="types"><PrezUINode v-for="t in props.focusNode.rdfTypes" v-bind="t" badge :showProv="false" :showType="false" /></div></div>
            <div class="flex-row">IRI: <div class="iri"><a :href="props.focusNode.value" target="_blank" rel="noopener noreferrer">{{ props.focusNode.value }}</a><CopyButton :value="props.focusNode.value" iconOnly /></div></div>
        </div>
        <p v-if="props.focusNode.description" class="desc">{{ props.focusNode.description.value }}</p>
        <slot></slot>
        <PrezUIObjectTable :properties="props.properties" :members="props.focusNode.members" :concepts="props.focusNode.concepts" :key="Object.keys(props.properties).length" />
    </main>
    <div id="right-nav">
        <slot name="rightNav"></slot>
        <ProfileNav :profiles="props.profiles" :path="props.path" />
    </div>
</template>

<style lang="scss" scoped>
.flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
}

.types {
    display: flex;
    flex-direction: row;
    gap: 6px;
}

.iri {
    padding: 8px;
    background-color: #e9e9e9;
    border-radius: 4px;
    font-family: monospace;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
}

.desc {
    font-style: italic;
}

#right-nav {
    padding: 12px;
    max-width: 300px;
}
</style>