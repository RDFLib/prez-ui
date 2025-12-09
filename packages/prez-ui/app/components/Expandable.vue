<script lang="ts" setup>
import { Expandable, type ExpandableProps } from "prez-components";

const props = defineProps<ExpandableProps>();
</script>

<template>
    <Expandable v-bind="props" />
</template>
