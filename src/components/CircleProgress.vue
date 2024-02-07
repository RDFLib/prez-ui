<script lang="ts" setup>
import { computed } from "vue";
// import ToolTip from "@/components/ToolTip.vue";

const props = defineProps<{
    value?: number;
    max?: number;
    percentage?: number;
    label?: string;
    tickWhenComplete?: boolean;
    gradient?: boolean;
    // tooltip?: boolean;
}>();

const percent = computed(() => {
    if (props.value !== undefined && props.max !== undefined) {
        return props.value / props.max * 100;
    } else if (props.percentage !== undefined) {
        return props.percentage;
    } else {
        return 0;
    }
});

const percentColour = computed(() => {
    if (percent.value < 34) {
        return "230, 0, 0"; // red
    } else if (percent.value <= 80) {
        return "255, 165, 0"; // orange
    } else if (percent.value < 100) {
        return "175, 230, 0"; // light yellowish-green
    } else if (percent.value == 100) {
        return "0, 230, 38"; // green
    } else {
        return "128, 128, 128"; // grey, invalid
    }
});

const percentColourHsl = computed(() => {
    const startColour = 0; // red
    const endColour = 75; // light yellowish-green
    const completeColour = 130; // green

    const hue = percent.value === 100 ? completeColour : (endColour - startColour) * percent.value / 100;

    return `${hue}, 100%, 45%`;

    // 0, 0%, 50% // invalid
});
</script>

<template>
    <!-- <component :is="props.tooltip ? ToolTip : 'slot'"> -->
        <div :class="`circle-progress`" :style="{ background: `conic-gradient(${props.gradient ? `hsl(${percentColourHsl}` : `rgb(${percentColour}`}) ${percent}%, 0, ${props.gradient ? `hsla(${percentColourHsl}` : `rgba(${percentColour}`}, 0.2) ${100 - percent}%)` }">
            <div class="circle-overlay">
                <span class="circle-value">
                    <template v-if="props.label">{{ props.label }}</template>
                    <template v-else-if="props.tickWhenComplete && percent === 100"><i class="fa-solid fa-check"></i></template>
                    <template v-else-if="props.value !== undefined && props.max !== undefined">{{ props.value }}/{{ props.max }}</template>
                    <template v-else-if="props.percentage !== undefined">{{ props.percentage }}%</template>
                </span>
            </div>
        </div>
        <!-- <template v-if="props.tooltip" #text>
            <template v-if="props.value !== undefined && props.max !== undefined">{{ props.value }}/{{ props.max }}</template>
            <template v-else-if="props.percentage !== undefined">{{ props.percentage }}%</template>
        </template>
    </component> -->
</template>

<style lang="scss" scoped>
.circle-progress {
    border-radius: 50%;
    height: 100%;
    width: 100%;
    aspect-ratio: 1;
    position: relative;

    .circle-overlay {
        border-radius: 50%;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        inset: 0.5rem;

        .circle-value {
            font-size: 0.9em;
        }
    }
}
</style>