<script lang="ts" setup>
import { literal, type PrezLinkParent, type PrezLiteral } from '@/base/lib';
import type { MenuItem } from 'primevue/menuitem';

type ItemBreadcrumbPart = {
    label: string | PrezLiteral;
    segment?: string;
    url: string;
}

interface Props {
    prepend?: ItemBreadcrumbPart[];
    nameSubstitutions?: Record<string, string>;
    parents?: PrezLinkParent[];
    customItems?: ItemBreadcrumbPart[];    
}

const props = defineProps<Props>();
const parents = props.parents;

const links = [...(props.prepend || []), ...(props.customItems ?
    // simplify customItems' labels into a literal object for standard rendering...
    props.customItems.map(item=>({...item, label: typeof(item.label) == 'string' ? literal(item.label) : item.label}))
    : parents || [])];

</script>
<template>
    <Breadcrumb v-if="links" :model="links as MenuItem[]" style="background-color: transparent;padding-left: 0;">
        <template #item="{ item }">
            <Literal :term="typeof(item.label) == 'object' ? item.label : literal(item.label || item.segment || item.url)">
                <template #text="{ text }">
                    <ItemLink variant="breadcrumb" :to="item.url">
                        <div class="whitespace-nowrap max-w-[14rem] overflow-hidden text-ellipsis">{{ props.nameSubstitutions ? props.nameSubstitutions?.[text] || text : text }}</div>
                    </ItemLink>
                </template>
            </Literal>
        </template>
        <template #separator> / </template>
    </Breadcrumb>
</template>
