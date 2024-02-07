import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import PrezUINav from "../components/PrezUINav.vue";

const meta = {
    title: "PrezUINav",
    component: PrezUINav,
    tags: ["autodocs"],
    argTypes: {
        sidenav: {
            description: "Boolean flag to toggle whether the navbar is a sidenav",
            defaultValue: true
        },
    },
} satisfies Meta<typeof PrezUINav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TopNav: Story = {
    args: {
        sidenav: false
    },
};

Default.decorators = [
    vueRouter()
];
