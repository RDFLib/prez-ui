<script setup lang="ts">
const useApi = useApiUrl();
const url = useApi.getApiUrl();
defineProps<{type: 'list'|'item'}>()

</script>
<template>
  <PrezUIDataPage
      :type="type"
      :url="url"
  />
</template>