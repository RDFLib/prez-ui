<script lang="ts" setup>
import { defineProps } from 'vue';
import type { ItemListProps } from '../types';
const props = defineProps<ItemListProps>();

const list = props.list;
const properties = list?.[0]?.properties;
//const headers = properties ? Object.keys(properties).map(p => properties[p]!.predicate) : undefined;

</script>
<template>
  <div v-if="list">
    <DataTable striped-rows :value="list" table-style="min-width: 50rem">
      <!-- frozen="false" was a fix to get around issues with unstyled presets -->      
      <Column :frozen="false">
        <template #header>
          <b>Item</b>
        </template>
        <template #body="slotProps">
          <Node :term="slotProps.data" variant="item-list" />
        </template>
      </Column>
      <Column
        :frozen="false"
        v-for="col in properties"
        :key="col.predicate.value"
      >
        <template #header>
          <b><Term :term="col.predicate" /></b>
        </template>
        <template #body="slotProps">
          <div v-for="(obj, idx) in slotProps.data.properties[col.predicate.value]?.objects"
            :key="idx">
            <Term 
              :term="obj"
              variant="item-list"
            />
          </div>
        </template>
      </Column>
    </DataTable>

  </div>
</template>

<style scoped>
</style>
