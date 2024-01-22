<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const open = ref(false);
const popoverRef = ref<HTMLElement | null>(null);

function handleDocumentClick(e: MouseEvent) {
    if (open.value && popoverRef.value && !popoverRef.value.contains(e.target as Node)) {
        open.value = false;
    }
}

onMounted(() => {
    document.body.addEventListener("click", handleDocumentClick);
});

onBeforeUnmount(() => {
    document.body.removeEventListener("click", handleDocumentClick);
});
</script>

<template>
    <span class="popover" ref="popoverRef">
        <button class="popover-btn btn outline sm" @click="open = !open">
            <slot></slot>
            <i :class="`fa-solid fa-chevron-${open ? 'up' : 'down'}`"></i>
        </button>
        <span v-show="open" class="popover-content">
            <slot name="content"></slot>
        </span>
    </span>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_mixins.scss";

.popover {
    position: relative;
    display: inline-block;

    .popover-content {
        box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.10);
        font-size: 14px;
        padding: 6px;
        background-color: white;
        border-radius: 6px;
        z-index: 999;
        position: absolute;
        top: 100%;
        display: flex;
        flex-direction: column;
    }
}
</style>