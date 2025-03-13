<script lang="ts" setup>
import { literal } from 'prez-lib';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-vue-next';
import { ItemBreadcrumbProps } from "@/types";
import Literal from "./Literal.vue";
import ItemLink from "./ItemLink.vue";

const props = withDefaults(defineProps<ItemBreadcrumbProps>(), {
    _components: () => {
        return {
            literal: Literal,
            itemLink: ItemLink,
        }
    }
});
const parents = props.parents;

const links = [...(props.prepend || []), ...(props.customItems ?
    // simplify customItems' labels into a literal object for standard rendering...
    props.customItems.map(item => ({...item, label: typeof(item.label) == 'string' ? literal(item.label) : item.label}))
    : parents || [])];

const textClassLast = 'whitespace-nowrap overflow-hidden text-ellipsis block';
const textClass = textClassLast + ' max-w-[14rem]';
const lastUrl = links[links.length - 1]?.url;
</script>

<template>
    <!-- ItemBreadcrumb -->
    <Breadcrumb v-if="links" class="breadcrumbs">
        <BreadcrumbList>
            <template v-for="item in links">
                <BreadcrumbItem>
                    <component :is="item.url != lastUrl ? BreadcrumbLink : BreadcrumbPage" as-child>
                        <component :is="props._components.literal" :term="typeof(item.label) == 'object' ? item.label : literal((item.label || item.segment || item.url) as string)">
                            <template #text="{ text }">
                                <component :is="props._components.itemLink" v-if="item.url != lastUrl || !item.url" :to="item.url" :class="textClass">
                                    {{ props.nameSubstitutions ? props.nameSubstitutions?.[text] || text : text }}
                                </component>
                                <span v-else :class="textClassLast">{{ props.nameSubstitutions ? props.nameSubstitutions?.[text] || text : text }}</span>
                            </template>
                        </component>
                    </component>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="item.url != lastUrl" class="breadcrumb-separator">
                    <ChevronRight class="size-4" />
                </BreadcrumbSeparator>
            </template>
        </BreadcrumbList>
    </Breadcrumb>
</template>
