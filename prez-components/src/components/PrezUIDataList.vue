<script lang="ts" setup>
import { PrezNode, type PrezDataList } from "prez-lib";
import { computed } from "vue";

// export interface PrezUIItemListProps {
//     data?: PrezItem[];
// };

const props = defineProps<{
    data: PrezDataList
}>();

// get the list of predicates that exist in item properties
const predicates = computed<PrezNode[]>(() => {
    if(!props?.data?.data) return [];
    const list = props.data.data.map(item => Object.values(item.properties).map(prop => prop.predicate)).flat(1);
    const iris: string[] = [];
    const p: PrezNode[] = [];
    list.forEach(item => {
        if (!iris.includes(item.value)) {
            p.push(item);
            iris.push(item.value);
        }        
    });
    return p;
});

</script>

<template v-if="props?.data">
    <slot name="header">
        <h2>Viewing results</h2>
    </slot>
    <slot name="results">
        <table>
            <thead>
                <tr>
                    <th v-for="pred of predicates">{{ pred.curie }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="props.data" v-for="row of props.data.data">
                    <td v-for="pred of predicates">
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
</style>