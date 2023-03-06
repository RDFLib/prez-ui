<script lang="ts" setup>
import { useRoute } from "vue-router";
import PropTable from "@/components/PropTable.vue";

const route = useRoute();
</script>

<template>
    <h1>Profile {{ route.params.profileId }}</h1>
    <p>Property table about this specific profile</p>
    <!-- <PropTable></PropTable> -->
</template>

<style lang="scss" scoped>

</style>