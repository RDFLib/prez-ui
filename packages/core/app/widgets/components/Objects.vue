<script lang="ts" setup>
import Objects from '@/base/components/Objects.vue';
import { type PrezNode, type PrezTerm } from '@/base/lib';

interface Props {
    term: PrezTerm; // parent term or root focus node
    predicate: PrezNode;
    objects: PrezTerm[];
}
const props = defineProps<Props>();

</script>
<template>
    <Objects :term="props.term" :predicate="props.predicate" :objects="props.objects">
        <template #default>
            <div v-if="props.predicate.value == 'http://purl.org/linked-data/registry#status'">
                THIS IS MY STATUS {{ props.objects }}
            </div>
        </template>
    </Objects>
</template>


