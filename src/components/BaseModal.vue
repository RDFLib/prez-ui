<script lang="ts" setup>
import { onMounted, onUnmounted, useSlots } from "vue";

const emit = defineEmits(["modalClosed"]);

const slots = useSlots();

const onEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
        emit("modalClosed");
    }
}

onMounted(() => {
    window.addEventListener("keyup", onEscape);
});

onUnmounted(() => {
    window.removeEventListener("keyup", onEscape);
});
</script>

<template>
    <div class="modal" @click.self="emit('modalClosed')">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-header-third">
                    <slot name="headerLeft"></slot>
                </div>
                <div class="modal-header-third middle">
                    <slot name="headerMiddle"></slot>
                </div>
                <div class="modal-header-third">
                    <slot name="headerRight"></slot>
                    <span @click="emit('modalClosed')" class="modal-close" title="Close"><i class="fa-light fa-xmark"></i></span>
                </div>
            </div>
            <div class="modal-body">
                <slot></slot>
            </div>
            <div class="modal-footer" v-if="!!slots.footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.modal {
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.4);

    .modal-content {
        background-color: white;
        margin: 10rem auto;
        width: 60%;
        display: flex;
        flex-direction: column;
        border-radius: $borderRadius;
        max-height: 70%;

        .modal-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 8px;
            gap: 8px;

            .modal-header-third {
                display: flex;
                flex-direction: row;
                gap: 8px;
                align-items: center;
                
                &:not(.middle) {
                    flex-basis: 0;
                    flex-grow: 1;
                }

                :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
                    margin-top: 0;
                    margin-bottom: 0;
                }
            }

            .modal-close {
                padding: 8px;
                color: #929292;
                cursor: pointer;
                margin-left: auto;

                &:hover {
                    color: #afafaf;
                }
            }
        }

        .modal-body {
            $borderColor: #c9c9c9;
            display: flex;
            flex-direction: column;
            padding: 8px;
            gap: 8px;
            overflow-y: auto;
            border-top: 1px solid $borderColor;
            border-bottom: 1px solid $borderColor;
        }

        .modal-footer {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
        }
    }
}
</style>
