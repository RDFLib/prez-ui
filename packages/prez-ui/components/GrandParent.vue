<script lang="ts" setup>
import { GrandParent } from "prez-components";

const parent = resolveComponent("Parent") as Component;
</script>

<template>
    <GrandParent :_components="{parent}" />
</template>
