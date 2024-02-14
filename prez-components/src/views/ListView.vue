<script lang="ts" setup>
import PrezUIItemList from "../components/PrezUIItemList.vue";
import { listProps } from "../util/story-data/PrezUIItemList";
</script>

<template>
    <div>
        <PrezUIItemList v-bind="listProps" />
    </div>
</template>
