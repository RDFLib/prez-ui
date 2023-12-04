import type { Meta, StoryObj } from "@storybook/vue3";

import TestButton from "../components/TestButton.vue";

const meta = {
    title: "TestButton",
    component: TestButton,
    tags: ["autodocs"],
    argTypes: {
        size: { control: "select", options: ["sm", "lg"], defaultValue: null, description: "The size of the button" },
        color: { control: "select", options: ["primary", "secondary"], defaultValue: null, description: "The colour of the button" },
        default: { control: "text", description: "The default slot for content" }
    },
} satisfies Meta<typeof TestButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        default: "Default button"
    },
};

export const Primary: Story = {
    args: {
        color: "primary",
        default: "Primary button"
    },
};

export const Secondary: Story = {
    args: {
        color: "secondary",
        default: "Secondary button"
    },
};

export const Large: Story = {
    args: {
        size: "lg",
        default: "Large button"
    },
};

export const Small: Story = {
    args: {
        size: "sm",
        default: "Small button"
    },
};
