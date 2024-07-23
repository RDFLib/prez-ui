// @prefix sbs
// @description storybook stories for a standard component

import type { Meta, StoryObj } from "@storybook/vue3";
import Tester from "../components/Tester.vue";

/**
 * 
 */
const meta = {
  title: "Testing/Tester",
  component: Tester,
  tags: ["autodocs"],
} satisfies Meta<typeof Tester>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default:Story = {
};
