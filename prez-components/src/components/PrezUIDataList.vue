<script lang="ts" setup>
import { PrezNode, type PrezDataList } from "prez-lib";
import PrezUINode from "./PrezUINode.vue";
const props = defineProps<{
    tableClass?: string,
    data?: PrezDataList,
    properties: PrezNode[]
}>();

</script>

<template v-if="props?.data">
    <slot name="header">
        <h2>Viewing results</h2>
    </slot>
    <slot name="results">
        <table :class="tableClass">
            <thead>
                <tr>
                    <th v-for="pred of properties"><PrezUINode v-bind="pred"/></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="props.data" v-for="row of props.data.data">
                    <td v-for="pred of properties">
                        <template v-if="row.properties[pred.value]">{{ row.properties[pred.value].objects.map(o=>o.value).join(',') }}</template>
                    </td>
                </tr>
            </tbody>
        </table>
    </slot>
    <slot name="footer" v-if="props?.data">
        {{ props.data.count }} results found
    </slot>
</template>

<style lang="scss" scoped>
table {
    border: 1px solid #eee;
}
th {
  width: 1%;
}
td {
  width: 100%;
}
td a {
  color:#333;
}
</style>