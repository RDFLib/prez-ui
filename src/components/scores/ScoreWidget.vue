<script lang="ts" setup>
import { ref } from "vue";
import FairScore from "@/components/scores/FairScore.vue";
import CareScore from "@/components/scores/CareScore.vue";

const props = defineProps<{
    score: {[key: string]: number};
    name: string;
}>();

const collapse = ref(false); // collapse to a badge
// click info to open modal
</script>

<template>
    <FairScore v-if="props.name === 'fair'" :score="score" />
    <CareScore v-else-if="props.name === 'care'" :score="score" />
</template>

<style lang="scss" scoped>

</style>