import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import { bnode, node, literal } from "prez-lib";
import PrezUIObjectTable from "../components/PrezUIObjectTable.vue";

const meta = {
    title: "PrezUIObjectTable",
    component: PrezUIObjectTable,
    tags: ["autodocs"],
    argTypes: {
        properties: { description: "The list of properties" },
        members: { description: "A list of member links" }
    },
} satisfies Meta<typeof PrezUIObjectTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const creator = node({
    value: "https://example.com/creator",
    curie: "ex:creator",
    label: literal("Creator"),
    description: literal("A creator is ...")
});

const issued = node({
    value: "https://example.com/issued",
    curie: "ex:issued",
    label: literal("Issued"),
    description: literal("The issued date is when ...")
});

const publisher = node({
    value: "https://example.com/publisher",
    curie: "ex:publisher",
    label: literal("Publisher"),
    description: literal("A publisher is ...")
});

export const Default: Story = {
    args: {
        properties: {
            [creator.value]: {
                predicate: creator,
                objects: [literal("object 1")]
            },
            [issued.value]: {
                predicate: issued,
                objects: [literal("object 2")]
            },
            [publisher.value]: {
                predicate: publisher,
                objects: [literal("object 3")]
            },
            // some blank node data to show nested tables
        }
    },
}

Default.decorators = [
    vueRouter()
];
