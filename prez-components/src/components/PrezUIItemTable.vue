<script lang="ts" setup>
import type { PrezUIItemTableProps } from '../types';
import { PrezFocusNode } from 'prez-lib';
const props = defineProps<PrezUIItemTableProps>();
const term = props.term as PrezFocusNode;
</script>
<template>
    <PrezUI v-bind="props" component="PrezUIItemTable">
        <table>
            <tbody>
                <template v-for="(prop, pred) in term.properties" :key="pred">
                    <slot name="widget-row" :property="prop">
                    <tr>
                        <th>
                            <slot name="widget-predicate" :property="prop">
                                <PrezUITerm :term="prop.predicate" />
                            </slot>
                        </th>
                        <td>
                            <slot name="widget-objects" :property="prop">
                                <PrezUITerm v-for="(obj, index) in prop.objects" :term="obj" :key="index" />
                            </slot>
                        </td>
                    </tr>
                    </slot>
                </template>
            </tbody>
        </table>
    </PrezUI>
</template>
<style scoped>
</style>