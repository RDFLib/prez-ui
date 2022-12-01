<script setup>

</script>

<template>
    <span class="tooltip">
        <slot></slot>
        <span class="tooltip-text">
            <slot name="text"></slot>
        </span>
    </span>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_mixins.scss";

.tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;

    &:hover {
        cursor: help;
    }

    .tooltip-text {
        $arrow-size: 6px;
        width: 250px;
        background-color: black;
        color: white;
        text-align: center;
        font-weight: normal;
        font-size: 14px;
        padding: 6px;
        border-radius: 6px;
        z-index: 999;
        visibility: hidden;
        position: absolute;
        bottom: calc(100% + #{$arrow-size});
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        @include transition(opacity);
        display: flex;
        flex-direction: column;
        gap: 12px;

        &::after {
            content: " ";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -$arrow-size;
            border-width: $arrow-size;
            border-style: solid;
            border-color: black transparent transparent transparent;
        }
    }

    &:hover .tooltip-text {
        visibility: visible;
        opacity: 0.9;
    }
}
</style>