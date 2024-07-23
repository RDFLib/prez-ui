<script lang="ts" setup>
import type { PrezUIItemListProps } from '@/types';
const props = defineProps<PrezUIItemListProps>();
const list = props.list;
const properties = list?.[0]?.properties;
const headers = properties ? Object.keys(properties).map(p=>properties[p].predicate) : undefined;
</script>
<template>
    <PrezUI v-bind="props" component="PrezUIList" :info="props.list">
        <table v-if="headers">
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
                    <td><PrezUITerm :term="item"></PrezUITerm></td>
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
    </PrezUI>
</template>
<style scoped>
</style>