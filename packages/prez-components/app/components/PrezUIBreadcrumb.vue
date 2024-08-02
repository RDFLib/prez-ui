<script lang="ts" setup>
import { literal } from 'prez-lib';
import type { PrezUIBreadcrumbProps } from '../types';
import Breadcrumb from 'primevue/breadcrumb';
import PrezUILiteral from './PrezUILiteral.vue';
import PrezUILink from './PrezUILink.vue';

const props = defineProps<PrezUIBreadcrumbProps>();
const parents = props.parents;

const links = props.customItems ?
    // simplify customItems' labels into a literal object for standard rendering...
    props.customItems.map(item=>({...item, label: typeof(item.label) == 'string' ? literal(item.label) : item.label}))
    : parents;

</script>
<template>
    <div class="pz-breadcrumb">
        <Breadcrumb v-if="links" :model="links">
            <template #item="{ item }">
                <PrezUILiteral :term="item.label || literal(item.segment || item.url)">
                        <template #text="{ text }">
                            <PrezUILink variant="breadcrumb" :to="item.url">
                                {{ text }}
                            </PrezUILink>
                        </template>
                </PrezUILiteral>
            </template>
            <template #separator> / </template>
        </Breadcrumb>
    </div>
</template>
<style scoped>
.p-breadcrumb {
    padding-left:10px;
    background-color: transparent;
}
</style>