import type { Meta, StoryObj } from "@storybook/vue3";
import { PrezUIPageFooter } from "prez-components";

/**
 * The PrezUIPageFooter is used by the different base page templates:
 *  - PrezUIDataPage
 *  - PrezUIStaticPage
 * 
 * To change the footer of the site, simply override the PrezUIPageFooter in your
 * PrezUI project by creating a new PrezUIPageFooter component.
 * 
 * You can either output new content in your component, or extend the base using
 * the options below.
 */
const meta = {
  title: "Page Components/PrezUIPageFooter",
  component: PrezUIPageFooter,
  tags: ["autodocs"],
  argTypes: {
  },
} satisfies Meta<typeof PrezUIPageFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story generator function
const createStory = (variant:'stacked'|'sidebar', templateContent: string): Story => ({
  args: {
    variant: variant,
  },
  render: (args) => ({
    components: { PrezUIPageFooter },
    setup() {
      return { args };
    },
    template: `
      <PrezUIPageFooter v-bind="args">
        ${templateContent}
      </PrezUIPageFooter>
    `,
  }),
});

/**
 * The default PrezUIPageHeader without overrides
 */
export const Default = createStory(
  'stacked',
  ``
);


/**
 * Simple overide for the default footer
 */
export const SimpleOverride = createStory(
  'stacked',
  `This is a new footer`
);

/**
 * Show the variant property
 */
export const ShowVariant = createStory(
  'stacked',
  `<template v-slot="{variant}">This is a new footer <br>variant = {{variant}}</template>`
);

/**
 * Override all footer contents, don't use the header class
 */
export const OverrideStyle = createStory(
  'sidebar',
  `<template #wrapper><div>Override the full style</div></template>`
);

