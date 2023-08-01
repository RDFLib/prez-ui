<script lang="ts" setup>
import CircleProgress from '@/components/CircleProgress.vue';

// need max scores per sub-score
const MAX_SCORES: {[key: string]: number} = {
    c: 8,
    a: 9,
    r: 9,
    e: 3
};

const props = defineProps<{
    score: {[key: string]: number};
}>();
</script>

<template>
    <div class="care-scores">
        <h5>CARE Score</h5>
        <div class="circles">
            <div v-for="score in 'care'" class="circle">
                <CircleProgress :value="props.score[score]" :max="MAX_SCORES[score]" />
                <div class="circle-name">{{ score.toUpperCase() }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.care-scores {
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