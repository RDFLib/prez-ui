<script lang="ts" setup>
import FairScore from "@/components/scores/FairScore.vue";
import CareScore from "@/components/scores/CareScore.vue";

const props = defineProps<{
    score: {[key: string]: number};
    name: string;
}>();
</script>

<template>
    <FairScore v-if="props.name === 'fair'" :score="score" />
    <CareScore v-else-if="props.name === 'care'" :score="score" />
</template>

<style lang="scss" scoped>

</style>