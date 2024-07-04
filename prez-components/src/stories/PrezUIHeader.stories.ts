import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import PrezUIHeader from "../components/PrezUIHeader.vue";
import { literal, node } from 'prez-lib';

const meta = {
    title: "Molecules/PrezUIHeader",
    component: PrezUIHeader,
    tags: ["autodocs"],
    argTypes: {
        term: { description: "Term data" }
    }
} satisfies Meta<typeof PrezUIHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        term: node("https://example.com/node1")
    }
};

export const HeaderWithLabel: Story = {
    args: {
        term: node({
            label: literal("Header with Label"),
            value: "https://example.com/node1"
        })
    }
};

export const HeaderWithDescription: Story = {
    args: {
        term: node({
            value: "https://example.com/node1",
            description: literal("Description line")
        })
    }
};

export const HeaderWithLabelAndDescription: Story = {
    args: {
        term: node({
            label: literal("Header with Label"),
            value: "https://example.com/node1",
            description: literal("Description line")
        })
    }
};


Default.decorators = [
    vueRouter()
];