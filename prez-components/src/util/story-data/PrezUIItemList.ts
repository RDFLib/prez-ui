import { PrezUIItemListProps } from "@/src/types";

export const listProps: PrezUIItemListProps = {
    items: [
        {
            focusNode: {
                value: "https://example.com/item1",
                label: {
                    value: "Item 1",
                    termType: "Literal"
                },
                links: [{value: "/link 1"}],
                description: {
                    value: "description 1",
                    termType: "Literal"
                },
                termType: "NamedNode",
                members: [
                    {
                        link: "/link 1/items",
                        label: "Members"
                    }
                ]
            },
            properties: {
                "https://example.com/predicate1": {
                    predicate: {
                        value: "https://example.com/predicate1",
                        label: {
                            value: "Predicate 1",
                            termType: "Literal",
                        },
                        termType: "NamedNode",
                    },
                    objects: [
                        {
                            value: "Object 1",
                            termType: "Literal",
                        }
                    ]
                }
            }
        },
    ],
};