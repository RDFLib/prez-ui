<script lang="ts" setup>
import PrezUIObjectTable from "../components/PrezUIObjectTable.vue";
import { tableProps } from "../util/storyData";
</script>

<template>
    <div>
        <PrezUIObjectTable v-bind="tableProps" />
    </div>
</template>
