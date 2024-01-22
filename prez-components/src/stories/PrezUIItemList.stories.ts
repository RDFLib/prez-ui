import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import PrezUIItemList from "../components/PrezUIItemList.vue";
import { listProps } from "../util/storyData";

const meta = {
    title: "PrezUIItemList",
    component: PrezUIItemList,
    tags: ["autodocs"],
    argTypes: {
        items: { description: "The list of items" },
        predicates: { description: "The list of predicates to render as columns" },
        childButton: { description: "The link button displayed on the right to navigate to a child list" },
    },
} satisfies Meta<typeof PrezUIItemList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: listProps,
}

Default.decorators = [
    vueRouter()
];
