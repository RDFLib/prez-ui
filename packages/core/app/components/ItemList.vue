<script lang="ts" setup>
import { defineProps } from 'vue';
import type { ItemListProps } from '../types';
const props = defineProps<ItemListProps>();

const list = props.list;
const properties = list?.[0]?.properties;
//const headers = properties ? Object.keys(properties).map(p => properties[p]!.predicate) : undefined;

</script>

<template>
  <DataTable v-if="list" striped-rows :value="list" table-style="min-width: 50rem">
    <Column>
      <template #header>
        <b>Item</b>
      </template>
      <template #body="slotProps">
        <Node :term="slotProps.data" variant="list-header" />
      </template>
    </Column>
    <Column>
      <template #header>
        <b>Description</b>
      </template>
      <template #body="slotProps">
        <Term v-if="slotProps.data.description" :term="slotProps.data.description" variant="list" />
      </template>
    </Column>
    <Column
      v-for="col in properties"
      :key="col.predicate.value"
    >
      <template #header>
        <b><Term :term="col.predicate" /></b>
      </template>
      <template #body="slotProps">
        <Term 
          v-for="obj in slotProps.data.properties[col.predicate.value].objects"
          :key="obj.value"
          :term="obj"
          variant="list"
        />
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
</style>
