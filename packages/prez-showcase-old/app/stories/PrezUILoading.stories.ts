import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import { PrezUILoading } from "prez-components";

/**
 * PrezUILoading is used while waiting for a request to complete.
 * 
 * This component has a variant parameter that is set when used in different scenarios.
 * 
 */
const meta = {
  title: "Standard Components/PrezUILoading",
  component: PrezUILoading,
  tags: ["autodocs"],
  argTypes: {
    variant: { description: "Variant" },
  },
} satisfies Meta<typeof PrezUILoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};

export const Item: Story = {
  args: {
    variant: 'item'
  },
};

export const List: Story = {
  args: {
    variant: 'list'
  },
};

export const Search: Story = {
  args: {
    variant: 'search'
  },
};

Default.decorators = [vueRouter()];
