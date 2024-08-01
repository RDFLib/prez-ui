<script setup lang="ts">
const rc = useRuntimeConfig()
</script>

<template>
  <div>
    <h1>Hello World!</h1>
    <pre>{{ rc }}</pre>
  </div>
</template>
