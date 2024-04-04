<script lang="ts" setup>
import { node, literal, bnode, type PrezProperties, type Concept } from "prez-lib";
import PrezUIObjectTable from "../components/PrezUIObjectTable.vue";
// import { Default as objectData } from "../stories/PrezUIObjectTable.stories";

const properties: PrezProperties = {
    ["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]: {
        predicate: node("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        objects: [
            node("http://www.w3.org/ns/dcat#Catalog")
        ]
    },
    ["https://prez.dev/test"]: {
        predicate: node("https://prez.dev/test"),
        objects: [
            literal("some text")
        ]
    },
}

const members = [
    {
        label: "Members",
        link: "/members"
    }
];

const concepts: Concept[] = [
    {
        ...node("https://example.com/concept1"),
        narrowers: [
            {
                ...node("https://example.com/concept1.1"),
                narrowers: [
                    {
                        ...node("https://example.com/concept1.1.1"),
                        narrowers: []
                    }
                ]
            }
        ]
    },
    {
        ...node("https://example.com/concept2"),
        narrowers: []
    },
    {
        ...node("https://example.com/concept3"),
        narrowers: []
    },
    {
        ...node("https://example.com/concept4"),
        narrowers: [
            {
                ...node("https://example.com/concept4.1"),
                narrowers: []
            },
        ]
    },
    {
        ...node("https://example.com/concept5"),
        narrowers: []
    }
]
</script>

<template>
    <div>
        <PrezUIObjectTable :properties="properties" :members="members" :concepts="concepts" />
    </div>
</template>
