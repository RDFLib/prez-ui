<script lang="ts" setup>
import { type PrezNode, type PrezDataList } from "prez-lib";

const props = defineProps<{
    tableClass?: string,
    data?: PrezDataList,
    properties: PrezNode[]
}>();

</script>

<template v-if="props?.data">
    <h2>Example customised list</h2>
    <ul>
        <li v-if="props.data" v-for="row of props.data.data">
            {{ row.focusNode.value }}
            <p>{{ Object.values(row.properties).map(prop=>prop.objects.map(o=>o.value)).join(', ') }}</p>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
p {
    margin-top: 5px;
    margin-left: 10px;
    color: blue;
}
</style>