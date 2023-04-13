<script lang="ts" setup>
const props = defineProps<{
    message: string;
    // type: string;
}>();
</script>

<template>
    <div class="error-message">
        <div class="symbol">
            <i class="fa-regular fa-circle-xmark"></i>
        </div>
        <div class="message">
            {{ props.message }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.error-message {
    border-radius: $borderRadius;
    background-color: #fbc2c2;
    padding: 20px;
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin: 0 40px;

    .symbol {
        color: red;
    }

    .message {

    }
}
</style>