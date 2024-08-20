<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PrezSearchResult } from '@/base/lib';

interface Props {
  results: PrezSearchResult[];
}

const props = defineProps<Props>();

// Access results from props
const results = props.results;

</script>

<template>
  <div v-if="results.length">
    <DataTable striped-rows :value="results.sort((a:PrezSearchResult, b:PrezSearchResult)=>b.weight - a.weight)">
      <Column>
        <template #body="slotProps">
          <Tag class="float-right" severity="info">
            <div class="text-xs">
              <Node :term="slotProps.data.predicate" variant="search-results" />
            </div>
          </Tag>
          <b><Term :term="slotProps.data.resource" variant="search-results" /></b>
          <div v-if="slotProps.data.resource.description">
            <Literal class="overflow-hidden text-ellipsis line-clamp-3" 
              hide-language 
              :term="slotProps.data.resource.description" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
</style>
