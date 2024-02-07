import { PrezUIItemListProps } from "@/src/types";

// PrezUIItemList
export const listProps: PrezUIItemListProps = {
    items: [
        {
            iri: "https://example.com/ksdjhfjksdhfsdf",
            label: {
                value: "W",
                termType: "literal"
            },
            links: [{value: "/link 1"}],
            description: {
                value: "description 1",
                termType: "literal"
            },
            termType: "node"
        },
        {
            iri: "https://example.com/89ok43rikiowefgomsd",
            label: {
                value: "A",
                termType: "literal"
            },
            links: [{value: "/link 2"}],
            description: {
                value: "description 2",
                termType: "literal"
            },
            termType: "node",
            extras: {
                "https://example.com/issued": {
                    value: "12-01-2024",
                    termType: "literal"
                }
            }
        },
        {
            iri: "https://example.com/poeidfopohsdnf",
            label: {
                value: "J",
                termType: "literal"
            },
            links: [{value: "/link 3"}],
            description: {
                value: "description 3",
                termType: "literal"
            },
            termType: "node",
            extras: {
                "https://example.com/publisher": {
                    iri: "https://example.com/me",
                    label: {
                        value: "me",
                        termType: "literal"
                    },
                    description: {
                        value: "desc",
                        termType: "literal"
                    },
                    termType: "node"
                }
            }
        },
    ],
    predicates: [
        {
            label: {
                value: "Publisher",
                termType: "literal"
            },
            iri: "https://example.com/publisher",
            description: {
                value: "Publisher description",
                termType: "literal"
            },
            termType: "node"
        },
        {
            label: {
                value: "Issued",
                termType: "literal"
            },
            iri: "https://example.com/issued",
            description: {
                value: "Issued description",
                termType: "literal"
            },
            termType: "node"
        },
        {
            label: {
                value: "Created",
                termType: "literal"
            },
            iri: "https://example.com/created",
            description: {
                value: "Created description",
                termType: "literal"
            },
            termType: "node"
        },
    ],
    childButton: {
        suffix: "/items",
        label: "Children"
    }
};