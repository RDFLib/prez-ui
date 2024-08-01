import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import { PrezUIMessage } from "prez-components";

const meta = {
  title: "Standard Components/PrezUIMessage",
  component: PrezUIMessage,
  tags: ["autodocs"],
  argTypes: {
    severity: { description: "Severity" },
  },
} satisfies Meta<typeof PrezUIMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Message default info contents'
  },
};

export const Info: Story = {
  args: {
    severity: 'info',
    text: 'Message info'
  },
};

export const Error: Story = {
  args: {
    severity: 'error',
    text: 'Error message'
  },
};

Default.decorators = [vueRouter()];
