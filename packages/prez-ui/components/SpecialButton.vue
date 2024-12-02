<script lang="ts" setup>
import { SpecialButton } from "prez-components";
</script>

<template>
    <component :is="SpecialButton"><slot>default value</slot></component>
</template>
