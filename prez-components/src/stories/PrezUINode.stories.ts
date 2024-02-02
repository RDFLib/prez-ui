import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import { node, nodeLink, nodePredicate } from "../util/story-data/PrezUINode";
import PrezUINode from "../components/PrezUINode.vue";

const meta = {
    title: "PrezUINode",
    component: PrezUINode,
    tags: ["autodocs"],
    argTypes: {
        iri: { description: "The IRI of the node", type: "string" },
        label: { description: "The node's label" },
        description: { description: "The node's description" },
        provenance: { description: "The node's provenance - used for a custom explanation of how this node/predicate is used in Prez" },
        curie: { description: "The node's curie, a shorthand notation using the namespace's prefix", type: "string" },
        links: { description: "An array of Prez links" },
        rdfTypes: { description: "An array of types" },
        showType: { description: "Toggles showing the type badges", type: "boolean" },
        showProv: { description: "Toggles showing the provenance tooltip", type: "boolean" },
        termType: { table: { disable: true } }
    },
} satisfies Meta<typeof PrezUINode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: node,
};
Default.decorators = [
    vueRouter()
];

export const Links: Story = {
    args: {
        ...nodeLink,
        showType: true
    },
};
Links.decorators = [
    vueRouter()
];

export const Predicate: Story = {
    args: {
        ...nodePredicate,
        showProv: true
    },
};
