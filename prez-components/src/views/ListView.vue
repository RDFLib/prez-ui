<script lang="ts" setup>
import { literal, node, type PrezItem } from "prez-lib";
import PrezUIItemList from "../components/PrezUIItemList.vue";
import { Default as listData } from "../stories/PrezUIItemList.stories";

// const items = [
//     {
//         "focusNode": {
//             "value": "http://example.com/bblock-catalog/bblocks",
//             "termType": "NamedNode",
//             "label": {
//                 "value": "A catalog of Building Block Vocabularies",
//                 "termType": "Literal",
//                 "datatype": {
//                     "value": "http://www.w3.org/2001/XMLSchema#string",
//                     "termType": "NamedNode"
//                 }
//             },
//             "members": [
//                 {
//                     "label": "Members",
//                     "link": "/items"
//                 }
//             ]
//         },
//         "properties": {
//             "https://prez.dev/members": {
//                 "predicate": {
//                     "value": "https://prez.dev/members",
//                     "termType": "NamedNode",
//                     "label": {
//                         "value": "members",
//                         "termType": "Literal",
//                         "datatype": {
//                             "value": "http://www.w3.org/2001/XMLSchema#string",
//                             "termType": "NamedNode"
//                         }
//                     }
//                 },
//                 "objects": [
//                     {
//                         "value": "n3-0",
//                         "properties": {
//                             "https://prez.dev/link": {
//                                 "predicate": {
//                                     "value": "https://prez.dev/link",
//                                     "termType": "NamedNode",
//                                     "label": {
//                                         "value": "link",
//                                         "termType": "Literal",
//                                         "datatype": {
//                                             "value": "http://www.w3.org/2001/XMLSchema#string",
//                                             "termType": "NamedNode"
//                                         }
//                                     }
//                                 },
//                                 "objects": [
//                                     {
//                                         "value": "/catalogs/bblck-ctlg:bblocks/collections",
//                                         "termType": "Literal",
//                                         "datatype": {
//                                             "value": "http://www.w3.org/2001/XMLSchema#string",
//                                             "termType": "NamedNode"
//                                         }
//                                     }
//                                 ]
//                             }
//                         },
//                         "termType": "BlankNode"
//                     }
//                 ]
//             }
//         },
//     },
//     {
//         "focusNode": {
//             "value": "https://example.com/TopLevelCatalog",
//             "termType": "NamedNode",
//             "label": {
//                 "value": "Top level catalog",
//                 "termType": "Literal",
//                 "datatype": {
//                     "value": "http://www.w3.org/2001/XMLSchema#string",
//                     "termType": "NamedNode"
//                 }
//             },
//             "members": [
//                 {
//                     "label": "Members",
//                     "link": "/items"
//                 }
//             ]
//         },
//         "properties": {
//             "https://prez.dev/members": {
//                 "predicate": {
//                     "value": "https://prez.dev/members",
//                     "termType": "NamedNode",
//                     "label": {
//                         "value": "members",
//                         "termType": "Literal",
//                         "datatype": {
//                             "value": "http://www.w3.org/2001/XMLSchema#string",
//                             "termType": "NamedNode"
//                         }
//                     }
//                 },
//                 "objects": [
//                     {
//                         "value": "n3-1",
//                         "properties": {
//                             "https://prez.dev/link": {
//                                 "predicate": {
//                                     "value": "https://prez.dev/link",
//                                     "termType": "NamedNode",
//                                     "label": {
//                                         "value": "link",
//                                         "termType": "Literal",
//                                         "datatype": {
//                                             "value": "http://www.w3.org/2001/XMLSchema#string",
//                                             "termType": "NamedNode"
//                                         }
//                                     }
//                                 },
//                                 "objects": [
//                                     {
//                                         "value": "/catalogs/exm:TopLevelCatalog/collections",
//                                         "termType": "Literal",
//                                         "datatype": {
//                                             "value": "http://www.w3.org/2001/XMLSchema#string",
//                                             "termType": "NamedNode"
//                                         }
//                                     }
//                                 ]
//                             }
//                         },
//                         "termType": "BlankNode"
//                     }
//                 ]
//             },
//         }
//     },
//     {
//         "focusNode": {
//             "value": "https://example.com/TopLevelCatalogTwo",
//             "termType": "NamedNode",
//             "label": {
//                 "value": "amazing catalog",
//                 "termType": "Literal",
//                 "datatype": {
//                     "value": "http://www.w3.org/2001/XMLSchema#string",
//                     "termType": "NamedNode"
//                 }
//             },
//             "members": [
//                 {
//                     "label": "Members",
//                     "link": "/items"
//                 }
//             ]
//         },
//         "properties": {
//             "https://prez.dev/members": {
//                 "predicate": {
//                     "value": "https://prez.dev/members",
//                     "termType": "NamedNode",
//                     "label": {
//                         "value": "members",
//                         "termType": "Literal",
//                         "datatype": {
//                             "value": "http://www.w3.org/2001/XMLSchema#string",
//                             "termType": "NamedNode"
//                         }
//                     }
//                 },
//                 "objects": [
//                     {
//                         "value": "n3-2",
//                         "properties": {
//                             "https://prez.dev/link": {
//                                 "predicate": {
//                                     "value": "https://prez.dev/link",
//                                     "termType": "NamedNode",
//                                     "label": {
//                                         "value": "link",
//                                         "termType": "Literal",
//                                         "datatype": {
//                                             "value": "http://www.w3.org/2001/XMLSchema#string",
//                                             "termType": "NamedNode"
//                                         }
//                                     }
//                                 },
//                                 "objects": [
//                                     {
//                                         "value": "/catalogs/exm:TopLevelCatalogTwo/collections",
//                                         "termType": "Literal",
//                                         "datatype": {
//                                             "value": "http://www.w3.org/2001/XMLSchema#string",
//                                             "termType": "NamedNode"
//                                         }
//                                     }
//                                 ]
//                             }
//                         },
//                         "termType": "BlankNode"
//                     }
//                 ]
//             },
//         }
//     },
//     {
//         "focusNode": {
//             "value": "https://example.com/VocPrezCatalog",
//             "termType": "NamedNode",
//             "label": {
//                 "value": "A Demo Catalog",
//                 "termType": "Literal",
//                 "datatype": {
//                     "value": "http://www.w3.org/2001/XMLSchema#string",
//                     "termType": "NamedNode"
//                 }
//             },
//             "members": [
//                 {
//                     "label": "Members",
//                     "link": "/items"
//                 }
//             ]
//         },
//         "properties": {
//             "https://prez.dev/members": {
//                 "predicate": {
//                     "value": "https://prez.dev/members",
//                     "termType": "NamedNode",
//                     "label": {
//                         "value": "members",
//                         "termType": "Literal",
//                         "datatype": {
//                             "value": "http://www.w3.org/2001/XMLSchema#string",
//                             "termType": "NamedNode"
//                         }
//                     }
//                 },
//                 "objects": [
//                     {
//                         "value": "n3-3",
//                         "properties": {
//                             "https://prez.dev/link": {
//                                 "predicate": {
//                                     "value": "https://prez.dev/link",
//                                     "termType": "NamedNode",
//                                     "label": {
//                                         "value": "link",
//                                         "termType": "Literal",
//                                         "datatype": {
//                                             "value": "http://www.w3.org/2001/XMLSchema#string",
//                                             "termType": "NamedNode"
//                                         }
//                                     }
//                                 },
//                                 "objects": [
//                                     {
//                                         "value": "/catalogs/exm:VocPrezCatalog/collections",
//                                         "termType": "Literal",
//                                         "datatype": {
//                                             "value": "http://www.w3.org/2001/XMLSchema#string",
//                                             "termType": "NamedNode"
//                                         }
//                                     }
//                                 ]
//                             }
//                         },
//                         "termType": "BlankNode"
//                     }
//                 ]
//             },
//         }
//     }
// ];

const data: PrezItem[] = [
    {
        focusNode: {
            ...node({
                value: "https://example.com/item1",
                label: literal("Item 1"),
                description: literal("description"),
                links: [{ value: "/item1" }],
                rdfTypes: [
                    node({
                        value: "https://example.com/type1",
                        label: literal("Type 1"),
                        description: literal("description")
                    })
                ]
            }),
            members: [
                {
                    label: "Members",
                    link: "/members"
                }
            ]
        },
        properties: {
            "https://example.com/predicate1": {
                predicate: node("https://example.com/predicate1"),
                objects: [literal("obj")]
            }
        }
    },
    {
        focusNode: {
            ...node({
                value: "https://example.com/item2",
                label: literal("Item 2"),
                description: literal("description"),
                links: [{ value: "/item2" }],
                rdfTypes: [
                    node({
                        value: "https://example.com/type2",
                        label: literal("Type 2"),
                        description: literal("description")
                    })
                ]
            }),
            members: [
                {
                    label: "Members",
                    link: "/members"
                }
            ]
        },
        properties: {}
    },
    {
        focusNode: {
            ...node({
                value: "https://example.com/item3",
                label: literal("Item 3"),
                description: literal("description"),
                links: [{ value: "/item3" }],
                rdfTypes: [
                    node({
                        value: "https://example.com/type3",
                        label: literal("Type 3"),
                        description: literal("description")
                    })
                ]
            }),
            members: [
                {
                    label: "Members",
                    link: "/members"
                }
            ]
        },
        properties: {}
    },
]
</script>

<template>
    <div>
        <PrezUIItemList :data="data" />
    </div>
</template>
