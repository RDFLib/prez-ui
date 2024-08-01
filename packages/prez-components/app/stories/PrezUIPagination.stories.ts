import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import PrezUIPagination from "../components/PrezUIPagination.vue";

const meta = {
  title: "Standard Components/PrezUIPagination",
  component: PrezUIPagination,
  tags: ["autodocs"],
  argTypes: {
  },
} satisfies Meta<typeof PrezUIPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalCount: 100,
    page: 1,
    rows: 20
  },
};

export const NextAndPrevPage: Story = {
  args: {
    totalCount: 100,
    page: 4,
    rows: 20
  },
};

export const LastPage: Story = {
  args: {
    totalCount: 100,
    page: 5,
    rows: 20
  },
};

export const OnePageResults: Story = {
  args: {
    totalCount: 10,
    page: 1,
    rows: 20
  },
};

export const NoResults: Story = {
  args: {
    totalCount: 0,
    page: 1,
    rows: 0
  },
};

Default.decorators = [vueRouter()];
