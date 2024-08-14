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
    <DataTable striped-rows :value="results.sort((a, b)=>b.weight - a.weight)" table-style="min-width: 50rem">
      <Column header="Results">
        <template #body="slotProps">
          <ItemLink :to="slotProps.data.resource">
            <b><Term :term="slotProps.data.resource" variant="header" /></b>
          </ItemLink>
          <!-- <Literal :term="slotProps.data.resource.description" /> -->
            {{ slotProps.data.resource.description?.value }}
        </template>
      </Column>
      <!-- <Column header="Hash" field="hash">
        <template #body="slotProps">
          {{ slotProps.data.hash }}
        </template>
      </Column>
      <Column header="Predicate" field="predicate">
        <template #body="slotProps">
          <Term :term="slotProps.data.predicate" variant="list-header" />
        </template>
      </Column>
      <Column header="Resource" field="resource">
        <template #body="slotProps">
          <Term :term="slotProps.data.resource" variant="list-header" />
        </template>
      </Column>
      <Column header="Weight" field="weight">
        <template #body="slotProps">
          {{ slotProps.data.weight }}
        </template>
      </Column>
      <Column title="Match" field="match">
        <template #body="slotProps">
          <Term :term="slotProps.data.match" variant="list-header" />
        </template>
      </Column> -->
    </DataTable>
  </div>
</template>

<style scoped>
</style>
