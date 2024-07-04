<script lang="ts" setup>
import type { PrezUIPropertyTableProps } from '../types';
import PrezUITerm from './PrezUITerm.vue';
import PrezUIDebug from './PrezUIDebug.vue';
const props = defineProps<PrezUIPropertyTableProps>();

</script>
<template>
    <PrezUIDebug :debug="props.debug" title="PrezUIPropertyTable" :info="props.properties">
        <table :class="props.debug ? 'debug' : undefined">
            <tbody>
                <tr v-for="(prop, pred) in props.properties" :key="pred">
                    <th><PrezUITerm :debug="props.debug" :term="prop.predicate"></PrezUITerm></th>
                    <td><PrezUITerm :debug="props.debug" v-for="obj in prop.objects" :term="obj" :key="obj"></PrezUITerm></td>
                </tr>
            </tbody>
        </table>
    </PrezUIDebug>
</template>
<style scoped>
table.debug {
    border-collapse: collapse;
}
table.debug tr {
    border: 1px solid #33c;
}
</style>