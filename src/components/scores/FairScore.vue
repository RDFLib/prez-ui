<script lang="ts" setup>
import CircleProgress from '@/components/CircleProgress.vue';

// need max scores per sub-score
const MAX_SCORES: {[key: string]: number} = {
    f: 17,
    a: 10,
    i: 8,
    r: 7
};

const props = defineProps<{
    score: {[key: string]: number};
}>();
</script>

<template>
    <div class="fair-scores">
        <h5>FAIR Score</h5>
        <div class="circles">
            <div v-for="score in 'fair'" class="circle">
                <CircleProgress :value="props.score[score]" :max="MAX_SCORES[score]" />
                <div class="circle-name">{{ score.toUpperCase() }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.fair-scores {
    display: flex;
    flex-direction: column;
    gap: 12px;

    h5 {
        margin: 0;
        font-size: 1rem;
    }

    .circles {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;

        .circle {
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: center;

            .circle-name {

            }
        }
    }
}
</style>