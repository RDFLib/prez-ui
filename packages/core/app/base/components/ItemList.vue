<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PrezFocusNode, PrezNodeList } from '../lib';

interface Props {
  /** optional, fields in order to display */
  fields?: PrezNodeList[];
  list: PrezFocusNode[];
}

const props = defineProps<Props>();
const list = props.list;

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
        v-if="fields"
        :frozen="false"
        v-for="col in fields"
        :key="col.node.value"
      >
        <template #header="slotProps">
          <b><Predicate :predicate="col.node" :objects="[]" /></b>
        </template>
        <template #body="slotProps">
          <Objects v-if="slotProps.data.properties[col.node.value]?.objects" 
            :term="col.node"
            :predicate="col.node" 
            :objects="slotProps.data.properties[col.node.value]?.objects" 
            variant="item-list" />
        </template>
      </Column>
    </DataTable>

  </div>
</template>

<style scoped>
</style>
