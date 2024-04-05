<script lang="ts" setup>
import { PrezUINode, CopyButton } from "prez-components";
import type { ProfileHeader, PrezItem } from "prez-lib";
import Message from "primevue/message";
import Skeleton from "primevue/skeleton";
import PrezUIObjectTable from "./PrezUIObjectTable.vue";

const props = defineProps<{
    data?: PrezItem;
    path: string;
    profiles: ProfileHeader[];
    loading?: boolean;
    error?: Error | null;
}>();

const tableData = computed(() => {
    if (props.data) {
        return {
            properties: props.data.properties,
            members: props.data.focusNode?.members,
            concepts: props.data.focusNode?.concepts
        }
    } else {
        return undefined;
    }
});
</script>

<template>
    <main>
        <Message v-if="props.error" severity="error" :closable="false">Error: {{ props.error.message }}</Message>
        <template v-else>
            <div class="item-header">
                <template v-if="props.loading">
                    <Skeleton height="2rem" width="12rem" class="mb-2" style="margin-bottom: 20px"></Skeleton>
                    <Skeleton width="30rem" class="mb-2" style="margin-bottom: 8px"></Skeleton>
                    <Skeleton width="30rem" class="mb-2" style="margin-bottom: 12px"></Skeleton>
                </template>
                <template v-else-if="props.data">
                    <h1>{{ props.data.focusNode.label?.value || props.data.focusNode.value }}</h1>
                    <div class="flex-row" style="margin-bottom: 8px">Type: <div class="types"><PrezUINode v-for="t in props.data.focusNode.rdfTypes" v-bind="t" badge :showProv="false" :showType="false" /></div></div>
                    <div class="flex-row">IRI: <div class="iri"><a :href="props.data.focusNode.value" target="_blank" rel="noopener noreferrer">{{ props.data.focusNode.value }}</a><CopyButton :value="props.data.focusNode.value" iconOnly /></div></div>
                </template>
            </div>
            <p class="desc">
                <Skeleton v-if="props.loading" width="30rem" class="mb-2"></Skeleton>
                <template v-else-if="props.data">{{ props.data.focusNode.description?.value }}</template>
            </p>
            <slot></slot>
            <PrezUIObjectTable :data="tableData" :key="Object.keys(props.data?.properties || {}).length" :loading="props.loading" />
        </template>
    </main>
    <div id="right-nav">
        <slot name="rightNav"></slot>
        <ProfileNav :profiles="props.profiles" :path="props.path" :loading="props.loading" />
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
    min-width: 280px;
    max-width: 280px;
}
</style>