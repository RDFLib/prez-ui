<script lang="ts" setup>
import type { PrezItemPage } from "prez-components";
import PrezUIObjectTable from "./PrezUIObjectTable.vue";

const props = defineProps<PrezItemPage>();
</script>

<template>
    <main>
        <div class="item-header">
            <h1>{{ props.focusNode.label?.value || props.focusNode.value }}</h1>
            <div>Type: </div>
            <div>IRI: {{ props.focusNode.value }}</div>
        </div>
        <p v-if="props.focusNode.description" class="desc">{{ props.focusNode.description.value }}</p>
        <PrezUIObjectTable :properties="props.properties" />
    </main>
    <div>alt nav</div>
</template>

<style lang="scss" scoped>
.desc {
    font-style: italic;
}
</style>