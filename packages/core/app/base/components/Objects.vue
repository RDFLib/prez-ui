<script lang="ts" setup>
import { type PrezNode, type PrezTerm } from '@/base/lib';

interface Props {
    term: PrezTerm; // parent term or root focus node
    predicate: PrezNode;
    objects: PrezTerm[];
}
const props = defineProps<Props>();

</script>
<template>
    <slot>
        <div v-for="(obj, index) of props.objects" :key="index" >
            <Term :term="obj" variant="item-table" />
        </div>
    </slot>
</template>
