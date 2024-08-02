<script setup lang="ts">

const api = useApi();
const url = api.getApiUrl();
defineProps<{type: 'list'|'item'}>()

</script>
<template>
  <PrezUIDataPage
      :type="type"
      :url="url"
  />
</template>