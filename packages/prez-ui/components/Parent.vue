<script lang="ts" setup>
import { Parent } from "prez-components";

const child = resolveComponent("Child") as Component;
</script>

<template>
    <Parent :_components="{child}" />
</template>
