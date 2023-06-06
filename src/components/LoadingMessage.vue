<script lang="ts" setup>

</script>

<template>
    <div class="loading-message">
        <div class="message">
            <i class="fa-regular fa-spinner-third fa-spin"></i>
            <span>Loading...</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.loading-message {
    border-radius: $borderRadius;
    background-color: var(--cardBg);
    padding: 20px;
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin: 0 40px;

    .message {
        display: flex;
        flex-direction: row;
        gap: 12px;
    }
}
</style>