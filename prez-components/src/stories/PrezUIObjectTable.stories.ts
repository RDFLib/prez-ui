import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import PrezUIObjectTable from "../components/PrezUIObjectTable.vue";
import { tableProps } from "../util/story-data/PrezUIObjectTable";

const meta = {
    title: "PrezUIObjectTable",
    component: PrezUIObjectTable,
    tags: ["autodocs"],
    argTypes: {
        properties: { description: "The list of properties" },
    },
} satisfies Meta<typeof PrezUIObjectTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: tableProps,
}

Default.decorators = [
    vueRouter()
];
