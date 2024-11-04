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
  <!-- ItemList -->    
  <div v-if="list">
    <table style="min-width: 50rem">
        <thead>
            <tr>
                <th><b>Item</b></th>
                <template v-if="fields">
                    <th v-for="col in fields"><b><Predicate :predicate="col.node" :objects="[]" /></b></th>
                </template>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in list">
                <td><Node :term="item" variant="item-list" /></td>
                <template v-if="fields">
                    <td v-for="col in fields">
                        <Objects v-if="item.properties?.[col.node.value]?.objects" 
                            :term="col.node"
                            :predicate="col.node" 
                            :objects="item.properties[col.node.value]?.objects" 
                            variant="item-list" />
                    </td>
                </template>
            </tr>
        </tbody>
    </table>
  </div>
</template>
