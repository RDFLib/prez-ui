<script setup lang="ts">
import PrezUIStaticPage from '@prez-components/PrezUIStaticPage.vue';

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