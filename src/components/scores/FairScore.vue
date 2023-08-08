<script lang="ts" setup>
import { ref } from "vue";
import CircleProgress from "@/components/CircleProgress.vue";
import BaseModal from "@/components/BaseModal.vue";

// need max scores per sub-score
const MAX_SCORES: {[key: string]: number} = {
    f: 17,
    a: 10,
    i: 8,
    r: 7
};

// need details for each sub-score

const props = defineProps<{
    score: {[key: string]: number};
}>();

const showModal = ref<boolean>(false);
</script>

<template>
    <div class="fair-scores">
        <div class="score-title">
            <h5>FAIR Score</h5>
            <button class="btn outline" @click="showModal = true" title="Show details"><i class="fa-regular fa-circle-info"></i></button>
        </div>
        <div class="circles">
            <div v-for="score in 'fair'" class="circle">
                <CircleProgress :value="props.score[score]" :max="MAX_SCORES[score]" tickWhenComplete />
                <div class="circle-name">{{ score.toUpperCase() }}</div>
            </div>
        </div>
    </div>
    <BaseModal v-if="showModal" @modalClosed="showModal = false">
        <template #headerMiddle><h3>FAIR Scores</h3></template>
        <p>In 2016, the <a href="https://doi.org/10.1038/sdata.2016.18" target="_blank" rel="noopener noreferrer">'FAIR Guiding Principles for scientific data management and stewardship'</a> were published in the open-access journal, Scientific Data. The authors intended to provide guidelines to improve the Findability, Accessibility, Interoperability, and Reuse of digital assets.</p>
        <p>The principles are set out in full on the <a href="https://www.go-fair.org/fair-principles/" target="_blank" rel="noopener noreferrer">GO FAIR website</a>. ARDC also offers comprehensive <a href="https://ardc.edu.au/resource/fair-data/" target="_blank" rel="noopener noreferrer">information and training</a>. The FAIR Principles refer to three types of entities: data, metadata and infrastructure. </p>
        <div class="score-details">
            <div class="score-detail">
                <div class="score-detail-title">
                    <CircleProgress :value="props.score.f" :max="MAX_SCORES.f" />
                    <h4>F - Findable</h4>
                </div>
                <div class="score-detail-desc">
                    <p>Metadata and data should be easy to find for both humans and computers.</p>
                </div>
            </div>
            <div class="score-detail">
                <div class="score-detail-title">
                    <CircleProgress :value="props.score.a" :max="MAX_SCORES.a" />
                    <h4>A - Accessible</h4>
                </div>
                <div class="score-detail-desc">
                    <p>Once data is found, access information needs to be clearly indicated on the metadata.</p>
                </div>
            </div>
            <div class="score-detail">
                <div class="score-detail-title">
                    <CircleProgress :value="props.score.i" :max="MAX_SCORES.i" />
                    <h4>I - Interoperable</h4>
                </div>
                <div class="score-detail-desc">
                    <p>The data should be able to be integrated with other data.</p>
                </div>
            </div>
            <div class="score-detail">
                <div class="score-detail-title">
                    <CircleProgress :value="props.score.r" :max="MAX_SCORES.r" />
                <h4>R - Reusable</h4>
                </div>
                <div class="score-detail-desc">
                    <p>Metadata and data should be well-described so that they can be replicated and/or combined in different settings.</p>
                </div>
            </div>
        </div>
    </BaseModal>
</template>

<style lang="scss" scoped>
.fair-scores {
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