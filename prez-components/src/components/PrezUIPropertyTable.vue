<script lang="ts" setup>
import type { PrezUIPropertyTableProps } from '@/types';
const props = defineProps<PrezUIPropertyTableProps>();
</script>
<template>
    <WithTheme v-bind="props" component="PrezUIPropertyTable" :info="props.properties">
        <table :class="props.debug ? 'debug' : undefined">
            <tbody>
                <tr v-for="(prop, pred) in props.properties" :key="pred">
                    <th><PrezUITerm :debug="props.debug" :term="prop.predicate"></PrezUITerm></th>
                    <td><PrezUITerm :debug="props.debug" v-for="(obj, index) in prop.objects" :term="obj" :key="index"></PrezUITerm></td>
                </tr>
            </tbody>
        </table>
    </WithTheme>
</template>
<style scoped>
table.debug {
    border-collapse: collapse;
}
table.debug tr {
    border: 1px solid #33c;
}
</style>