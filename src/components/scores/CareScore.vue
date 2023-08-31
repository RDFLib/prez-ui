<script lang="ts" setup>
import { ref } from "vue";
import CircleProgress from "@/components/CircleProgress.vue";
import BaseModal from "@/components/BaseModal.vue";

// need max scores per sub-score
const MAX_SCORES: {[key: string]: number} = {
    c: 8,
    a: 9,
    r: 9,
    e: 3
};

// need details for each sub-score

const props = defineProps<{
    score: {[key: string]: number};
}>();

const showModal = ref<boolean>(false);
</script>

<template>
    <div class="care-scores">
        <div class="score-title">
            <h5>CARE Score</h5>
            <button class="btn outline" @click="showModal = true" title="Show details"><i class="fa-regular fa-circle-info"></i></button>
        </div>
        <div class="circles">
            <div v-for="score in 'care'" class="circle">
                <CircleProgress :value="props.score[score]" :max="MAX_SCORES[score]" tickWhenComplete />
                <div class="circle-name">{{ score.toUpperCase() }}</div>
            </div>
        </div>
    </div>
    <BaseModal v-if="showModal" @modalClosed="showModal = false">
        <template #headerMiddle><h3>CARE Scores</h3></template>
        <p>The CARE principles, developed by the <a href="https://www.gida-global.org/care" target="_blank" rel="noopener noreferrer">Global Indigenous Data Alliance (GIDA)</a>, reflect the crucial role of data in advancing Indigenous innovation and self-determination. They ensure that data movements like the open data movement, whatever they're advocating and pursuing, respect the people and purpose behind the data.</p>
        <div class="score-details">
            <div class="score-detail">
                <div class="score-detail-title">
                    <CircleProgress :value="props.score.c" :max="MAX_SCORES.c" />
                    <h4>C - Collective Benefit</h4>
                </div>
                <div class="score-detail-desc">
                    <p>Data ecosystems shall be designed and function in ways that enable Indigenous Peoples to derive benefit from the data.</p>
                </div>
            </div>
            <div class="score-detail">
                <div class="score-detail-title">
                    <CircleProgress :value="props.score.a" :max="MAX_SCORES.a" />
                    <h4>A - Authority to Control</h4>
                </div>
                <div class="score-detail-desc">
                    <p>Indigenous Peoples' rights and interests in Indigenous data must be recognised and their authority to control such data be empowered.</p>
                </div>
            </div>
            <div class="score-detail">
                <div class="score-detail-title">
                    <CircleProgress :value="props.score.r" :max="MAX_SCORES.r" />
                    <h4>R - Responsibility</h4>
                </div>
                <div class="score-detail-desc">
                    <p>Those working with Indigenous data have a responsibility to share how those data are used to support Indigenous Peoples' self-determination and collective benefit.</p>
                </div>
            </div>
            <div class="score-detail">
                <div class="score-detail-title">
                    <CircleProgress :value="props.score.e" :max="MAX_SCORES.e" />
                    <h4>E - Ethics</h4>
                </div>
                <div class="score-detail-desc">
                    <p>Indigenous Peoples' rights and wellbeing should be the primary concern at all stages of the data life cycle and across the data ecosystem.</p>
                </div>
            </div>
        </div>
    </BaseModal>
</template>

<style lang="scss" scoped>
.care-scores {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .score-title {
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        
        h5 {
            margin: 0;
            font-size: 1rem;
        }
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

.score-details {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .score-detail {
        background-color: var(--cardBg);
        border-radius: 4px;
        overflow: hidden;

        $padding: 8px;

        .score-detail-title {
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: center;
            // justify-content: space-between;
            margin-bottom: 8px;
            border-bottom: 1px solid #9d9d9d;
            
            padding: $padding;
            
            .circle-progress {
                $size: 56px;
                height: $size;
                width: $size;

                :deep(.circle-overlay) {
                    // background-color: $titleBg;
                    background-color: var(--cardBg);
                    .circle-value {
                        font-size: 0.85em;
                    }
                }
            }
        }

        .score-detail-desc {
            padding: $padding;
        }
    }
}

p {
    margin-top: 0;
    margin-bottom: 6px;
}
</style>