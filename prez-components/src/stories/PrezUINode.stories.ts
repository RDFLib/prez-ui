import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import { node, literal } from "prez-lib"
import PrezUINode from "../components/PrezUINode.vue";

const meta = {
    title: "PrezUINode",
    component: PrezUINode,
    tags: ["autodocs"],
    argTypes: {
        value: { description: "The IRI of the node", type: "string" },
        label: { description: "The node's label" },
        description: { description: "The node's description" },
        provenance: { description: "The node's provenance - used for a custom explanation of how this node/predicate is used in Prez" },
        curie: { description: "The node's curie, a shorthand notation using the namespace's prefix", type: "string" },
        links: { description: "An array of Prez links" },
        rdfTypes: { description: "An array of types" },
        showType: { description: "Toggles showing the type badges", type: "boolean" },
        showProv: { description: "Toggles showing the provenance tooltip", type: "boolean" },
        showDesc: { description: "Toggles showing the description tooltip", type: "boolean" },
        showExt: { description: "Toggles showing the external link", type: "boolean" },
        badge: { description: "Toggles rendering the node as a badge", type: "boolean" },
        termType: { table: { disable: true } }
    },
} satisfies Meta<typeof PrezUINode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: node("https://example.com/node1"),
};

export const Links: Story = {
    args: {
        ...node({
            value: "https://example.com/node2",
            label: literal("Node 2"),
            links: [
                { value: "/c/node2" },
                { value: "/s/node2" },
                { value: "/v/node2" }
            ],
        })
    },
};
// required for rendering VueRouter's RouterLinks
Links.decorators = [
    vueRouter()
];

export const Predicate: Story = {
    args: {
        ...node({
            value: "https://example.com/predicate",
            curie: "ex:pred",
            label: literal("Predicate"),
            description: literal("This is a description for Predicate"),
            provenance: literal("This is provenance for Predicate")
        }),
        showProv: true,
        showDesc: true
    },
};

export const Types: Story = {
    args: {
        ...node({
            value: "https://example.com/node3",
            curie: "ex:pred",
            label: literal("Node 3"),
            description: literal("This is a description for Node 3"),
            provenance: literal("This is provenance for Node 3"),
            rdfTypes: [
                node({
                    value: "https://example.com/type1",
                    curie: "ex:type1",
                    label: literal("Type 1"),
                    description: literal("This is a description for Type 1"),
                }),
                node({
                    value: "https://example.com/type2",
                    curie: "ex:type1",
                    label: literal("Type 1"),
                    description: literal("This is a description for Type 1"),
                }),
            ]
        }),
        showType: true,
    },
};
