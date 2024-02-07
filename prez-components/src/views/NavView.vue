<script lang="ts" setup>
import PrezUINav from "../components/PrezUINav.vue";
</script>

<template>
    <h3>Navigation</h3>
    <PrezUINav :sidenav="false" />
    <div :style="{display: 'flex', flexDirection: 'row', flexGrow: 1}">
        <PrezUINav />
        <div :style="{flexGrow: 1}">content</div>
    </div>
</template>
