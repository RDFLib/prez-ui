<script lang="ts" setup>
import Card from "primevue/card";
import { PrezUIBlankNodeProps } from "../types"
import PrezUIObjectTable from "./PrezUIObjectTable.vue";

const props = defineProps<PrezUIBlankNodeProps>();
</script>

<template>
    <Card>
        <template #content>
            <PrezUIObjectTable :properties="props.properties" />
        </template>
    </Card>
</template>

<style lang="scss" scoped>

</style>