<script lang="ts" setup>
import { ref } from "vue";

const ARROW_SIZE = 6;

const props = withDefaults(defineProps<{
    position?: "top" | "right" | "bottom" | "left";
}>(), {
    position: "top"
});

const hover = ref(false);
const tooltip = ref<HTMLElement | null>(null);
const tooltipText = ref<HTMLElement | null>(null);

// TODO: tooltip positioning doesn't work on page scroll - need exact position
// TODO: use click event for touch devices

function positionTop() {
    if (tooltipText.value && tooltip.value) {
        const rect = tooltip.value.getBoundingClientRect();
        // position on top
        tooltipText.value.style.top = `${rect.top - tooltipText.value.clientHeight - ARROW_SIZE}px`;
        // horizontally center
        tooltipText.value.style.left = `${rect.left + tooltip.value.clientWidth / 2 - tooltipText.value.clientWidth / 2}px`;
    }
}

function positionRight() {
    if (tooltipText.value && tooltip.value) {
        const rect = tooltip.value.getBoundingClientRect();
        // position on right
        tooltipText.value.style.left = `${rect.right + ARROW_SIZE}px`;
        // vertically center
        tooltipText.value.style.top = `${rect.top + tooltip.value.clientHeight / 2 - tooltipText.value.clientHeight / 2}px`;
    }
}

function positionBottom() {
    if (tooltipText.value && tooltip.value) {
        const rect = tooltip.value.getBoundingClientRect();
        // position on bottom
        tooltipText.value.style.top = `${rect.bottom + ARROW_SIZE}px`;
        // horizontally center
        tooltipText.value.style.left = `${rect.left + tooltip.value.clientWidth / 2 - tooltipText.value.clientWidth / 2}px`;
    }
}

function positionLeft() {
    if (tooltipText.value && tooltip.value) {
        const rect = tooltip.value.getBoundingClientRect();
        // position on left
        tooltipText.value.style.left = `${rect.left - tooltipText.value.clientWidth - ARROW_SIZE}px`;
        // vertically center
        tooltipText.value.style.top = `${rect.top + tooltip.value.clientHeight / 2 - tooltipText.value.clientHeight / 2}px`;
    }
}

function onMouseEnter() {
    hover.value = true;

    switch(props.position) {
        case "top":
            positionTop();
            break;
        case "right":
            positionRight();
            break;
        case "bottom":
            positionBottom();
            break;
        case "left":
            positionLeft();
            break;
        default:
            positionTop();
    }
}

function onMouseLeave(e: MouseEvent) {
    // if hovered on tooltip text, keep visible
    hover.value = e.relatedTarget == tooltipText.value;
}

function onTextMouseLeave() {
    hover.value = false;
}
</script>

<template>
    <span ref="tooltip" class="tooltip" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <slot></slot>
        <Teleport to="body">
            <span ref="tooltipText" :class="`tooltip-text ${hover ? 'visible' : ''} arrow-${props.position}`" @mouseleave="onTextMouseLeave">
                <slot name="text"></slot>
            </span>
        </Teleport>
    </span>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
}

.tooltip-text {
    position: absolute;
    max-width: 200px;
    background-color: black;
    padding: 6px;
    border-radius: $borderRadius;
    color: white;
    font-size: 0.9em;
    text-align: center;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;

    &.visible {
        visibility: visible;
        opacity: 0.8;
    }

    &.arrow-top {
        &::after {
            content: " ";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: v-bind("`${-ARROW_SIZE}px`");
            border-width: v-bind("`${ARROW_SIZE}px`");
            border-style: solid;
            border-color: black transparent transparent transparent;
        }
    }

    &.arrow-right {
        &::after {
            content: " ";
            position: absolute;
            top: 50%;
            right: 100%;
            margin-top: v-bind("`${-ARROW_SIZE}px`");
            border-width: v-bind("`${ARROW_SIZE}px`");
            border-style: solid;
            border-color: transparent black transparent transparent;
        }
    }

    &.arrow-bottom {
        &::after {
            content: " ";
            position: absolute;
            bottom: 100%;
            left: 50%;
            margin-left: v-bind("`${-ARROW_SIZE}px`");
            border-width: v-bind("`${ARROW_SIZE}px`");
            border-style: solid;
            border-color: transparent transparent black transparent;
        }
    }

    &.arrow-left {
        &::after {
            content: " ";
            position: absolute;
            top: 50%;
            left: 100%;
            margin-top: v-bind("`${-ARROW_SIZE}px`");
            border-width: v-bind("`${ARROW_SIZE}px`");
            border-style: solid;
            border-color: transparent transparent transparent black;
        }
    }
}
</style>