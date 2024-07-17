<script lang="ts" setup>
import type { PrezUIListProps } from '@/types';
const props = defineProps<PrezUIListProps>();
const list = props.list;
const properties = list?.[0]?.properties;
const headers = properties ? Object.keys(properties).map(p=>properties[p].predicate) : undefined;
</script>
<template>
    <WithTheme v-bind="props" component="PrezUIList" :info="props.list">
        <table v-if="headers" :class="props.debug ? 'debug' : undefined">
            <thead>
                <tr>
                    <th>Name</th>
                    <th v-for="header of headers">
                        <PrezUITerm :term="header" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in list" :key="index">
                    <td><PrezUITerm :debug="props.debug" :term="item.focusNode"></PrezUITerm></td>
                    <td v-for="header of headers">
                        <template v-if="item?.properties?.[header.value]">
                            <PrezUITerm 
                                v-for="obj of item.properties[header.value].objects"
                                :term="obj"
                            />
                        </template>                            
                    </td>
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