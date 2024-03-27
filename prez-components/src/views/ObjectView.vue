<script lang="ts" setup>
import PrezUIObjectTable from "../components/PrezUIObjectTable.vue";
import { Default as objectData } from "../stories/PrezUIObjectTable.stories";
</script>

<template>
    <div>
        <PrezUIObjectTable :properties="objectData.args.properties" />
    </div>
</template>
