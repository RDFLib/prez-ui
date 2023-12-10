import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";

import ListTable from "../components/ListTable.vue";

const meta = {
    title: "ListTable",
    component: ListTable,
    tags: ["autodocs"],
    argTypes: {
        items: { description: "The list of items" },
    },
} satisfies Meta<typeof ListTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        items: [
            {
                uri: "uri 1",
                label: "label 1",
                link: "link 1",
                description: "description 1",
            },
            {
                uri: "uri 2",
                label: "label 2",
                link: "link 2",
                description: "description 2",
            },
            {
                uri: "uri 3",
                label: "label 3",
                link: "link 3",
                description: "description 3",
            },
        ]
    },
};

Default.decorators = [
    vueRouter()
];
