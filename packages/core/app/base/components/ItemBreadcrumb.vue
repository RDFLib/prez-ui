<script lang="ts" setup>
import { literal } from '@/base/lib';
import type { ItemBreadcrumbProps } from '../types';

const props = defineProps<ItemBreadcrumbProps>();
const parents = props.parents;

const links = [...(props.prepend || []), ...(props.customItems ?
    // simplify customItems' labels into a literal object for standard rendering...
    props.customItems.map(item=>({...item, label: typeof(item.label) == 'string' ? literal(item.label) : item.label}))
    : parents || [])];

</script>
<template>
    <Breadcrumb v-if="links" :model="links" style="background-color: transparent;padding-left: 0;">
        <template #item="{ item }">
            <Literal :term="typeof(item.label) == 'object' ? item.label : literal(item.label || item.segment || item.url)">
                <template #text="{ text }">
                    <ItemLink variant="breadcrumb" :to="item.url">
                        {{ props.nameSubstitutions ? props.nameSubstitutions?.[text] || text : text }}
                    </ItemLink>
                </template>
            </Literal>
        </template>
        <template #separator> / </template>
    </Breadcrumb>
</template>
