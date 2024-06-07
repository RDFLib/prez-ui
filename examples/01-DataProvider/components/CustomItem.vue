<script lang="ts" setup>
import type { PrezDataItem, PrezNode } from '../../../prez-lib/dist/types';


const props = defineProps<{
    data?: PrezDataItem
    properties?: PrezNode[]
}>();

</script>


<template>

<h2>
Focus node: {{ props.data?.data.focusNode.value }}
</h2>

Table:
<table class="table" v-if="props.properties">
    <thead>
        <tr>
            <th>Property</th>
            <th>Objects</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="prop in props.properties">
            <td>{{ prop }}</td>
            <td>{{ props.data?.data.properties[prop.value].objects }}</td>
        </tr>
    </tbody>
</table>

</template>

