<script lang="ts" setup>
import { PrezNode, type PrezDataItem } from "prez-lib";
import { computed } from "vue";

// export interface PrezUIItemListProps {
//     data?: PrezItem[];
// };

const props = defineProps<{
    data?: PrezDataItem
}>();

</script>

<template v-if="props?.data">
    <slot name="header">
        <h2>Viewing object {{ props?.data?.data.focusNode.value }}</h2>
    </slot>
    <slot name="results">
        <table>
            <tbody>
                <tr v-if="props?.data?.data?.properties" v-for="prop of Object.values(props.data.data.properties)">
                    <th>
                        {{ prop.predicate.value }}
                    </th>
                    <td>
                        {{ prop.objects.map(o=>o.value).join(',') }}
                    </td>
                </tr>
            </tbody>
        </table>
    </slot>
    <slot name="footer" v-if="props?.data">
    </slot>
</template>

<style lang="scss" scoped>
table {
    border: 1px solid #eee;
}
</style>