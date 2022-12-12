<script lang="ts" setup>
import PredCell from "@/components/PredCell.vue";
import ObjCell from "@/components/ObjCell.vue";

const props = defineProps({
    iri: String,
    qname: String,
    label: String,
    description: String,
    explanation: String,
    order: Number,
    objs: Array
});
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
        <td>
            <ObjCell v-for="obj in props.objs" v-bind="obj" />
        </td>
    </tr>
</template>

<style lang="scss" scoped>

</style>