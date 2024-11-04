<script lang="ts" setup>
import { literal, type PrezLinkParent, type PrezLiteral } from '@/base/lib';

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

const textClassLast = 'whitespace-nowrap overflow-hidden text-ellipsis block';
const textClass = textClassLast + ' max-w-[14rem]';
const lastUrl = links[links.length - 1]?.url;

</script>
<template>
    <!-- ItemBreadcrumb -->
    <div v-if="links" style="background-color: transparent;padding-left: 0;">
        <template v-for="item in links">
            <Literal :term="typeof(item.label) == 'object' ? item.label : literal(item.label || item.segment || item.url)">
                <template #text="{ text }">
                    <ItemLink v-if="item.url != lastUrl" :to="item.url" :class="textClass">
                        {{ props.nameSubstitutions ? props.nameSubstitutions?.[text] || text : text }}
                    </ItemLink>
                    <span v-else :class="textClassLast">{{ props.nameSubstitutions ? props.nameSubstitutions?.[text] || text : text }}</span>
                </template>
            </Literal>
            <span>/</span>
        </template>
    </div>
</template>
