import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";

import PrezUINode from "../components/PrezUINode.vue";
import { literal, node } from "prez-lib";

const meta = {
  title: "Data Components/PrezUINode",
  component: PrezUINode,
  tags: ["autodocs"],
  argTypes: {
    term: { description: "An example literal term" },
  },
} satisfies Meta<typeof PrezUINode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    term: node("http://abc.com"),
  },
};

export const NodeCurie: Story = {
  args: {
    term: node({ value: "http://abc.com/fred", curie: "abc:fred" }),
  },
};

export const NodeLabel: Story = {
  args: {
    term: node({ value: "http://abc.com/fred", label: literal("ABC") }),
  },
};

export const NodeCurieLabel: Story = {
  args: {
    term: node({
      value: "http://abc.com/fred",
      curie: "abc:fred",
      label: literal("ABC"),
    }),
  },
};

export const NodeDescription: Story = {
  args: {
    term: node({
      value: "http://abc.com/fred",
      description: literal("The ABC Shop"),
    }),
  },
};

export const NodeCurieDescription: Story = {
  args: {
    term: node({
      value: "http://abc.com/fred",
      curie: "abc:fred",
      description: literal("The ABC Shop"),
    }),
  },
};

export const NodeCurieDescriptionLabel: Story = {
  args: {
    term: node({
      value: "http://abc.com/fred",
      curie: "abc:fred",
      label: literal("ABC"),
      description: literal("The ABC Shop"),
    }),
  },
};

Default.decorators = [vueRouter()];
