import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import PrezUILink from "../components/PrezUILink.vue";

/**
 * PrezUILink is used for links in the Prez application.
 * 
 * This component can be overwritten to change the default behavior for links.
 * 
 */
const meta = {
  title: "Standard Components/PrezUILink",
  component: PrezUILink,
  tags: ["autodocs"],
  parameters: {
    slots: {
      default: {
        description: 'Default slot for the link text',
        template: `{{ args.default }}`,
      },
    }
  }
} satisfies Meta<typeof PrezUILink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: 'https://www.w3.org/',
    title: 'Navigate to W3C',
    default: `W3C`
  },
};

export const HrefOnly: Story = {
  args: {
    href: 'https://www.w3.org/',
    default: `W3C`
  }
};

export const InternalLink: Story = {
  args: {
    href: '/about',
    title: 'Internal route handling',
    default: `Internal about page`
  },
};

Default.decorators = [vueRouter()];
