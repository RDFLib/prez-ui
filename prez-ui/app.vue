<script lang="ts" setup>
import TestButton from "./components/TestButton.vue";
</script>


<template>
  <div>
    <!-- <TestButton>Nuxt Button</TestButton> -->
    <div>Prez UI</div>
    <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/c">CatPrez</NuxtLink>
    </nav>
    <NuxtPage />
  </div>
</template>
