<script lang="ts" setup>
import PredCell from "@/components/proptable/PredCell.vue";
import ObjCell from "@/components/proptable/ObjCell.vue";
import type { RowPred } from "@/types";

const props = defineProps<RowPred>();
</script>

<template>
    <tr>
        <PredCell
            :iri="props.iri"
            :qname="props.qname"
            :label="props.label"
            :description="props.description"
            :explanation="props.explanation"
        />
        <td class="prop-objs">
            <ObjCell v-for="obj in props.objs" v-bind="obj" :predIri="props.iri" />
        </td>
    </tr>
</template>

<style lang="scss" scoped>
.prop-objs {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
</style>