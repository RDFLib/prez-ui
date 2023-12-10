import type { Meta, StoryObj } from "@storybook/vue3";

import ObjectTable from "../components/ObjectTable.vue";

const meta = {
    title: "ObjectTable",
    component: ObjectTable,
    tags: ["autodocs"],
    argTypes: {
        properties: { description: "The properties data of the object" },
    },
} satisfies Meta<typeof ObjectTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        properties: [
            {
                predicate: "predicate",
                object: "object"
            },
        ]
    },
};
