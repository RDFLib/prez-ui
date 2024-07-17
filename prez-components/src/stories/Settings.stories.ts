import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import Settings from '../components/sb/Settings.vue';

const meta = {
  title: "Config/Settings",
  component: Settings
} satisfies Meta<typeof Settings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const System: Story = {};

System.decorators = [vueRouter()];
