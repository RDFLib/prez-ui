import type { Meta, StoryObj } from "@storybook/vue3";
import PrezUIPageHeader from "@/components/PrezUIPageHeader.vue";

/**
 * The PrezUIPageHeader is used by the different base page templates:
 *  - PrezUIDataPage
 *  - PrezUIStaticPage
 * 
 * To change the header of the site, simply override the PrezUIPageHeader in your
 * PrezUI project by creating a new PrezUIPageHeader component.
 * 
 * You can either output new content in your component, or extend the base using
 * the options below.
 */
const meta = {
  title: "Page Components/PrezUIPageHeader",
  component: PrezUIPageHeader,
  tags: ["autodocs"],
  argTypes: {
  },
} satisfies Meta<typeof PrezUIPageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story generator function
const createStory = (variant:'stacked'|'sidebar', templateContent: string): Story => ({
  args: {
    variant: variant,
  },
  render: (args) => ({
    components: { PrezUIPageHeader },
    setup() {
      return { args };
    },
    template: `
      <PrezUIPageHeader v-bind="args">
        ${templateContent}
      </PrezUIPageHeader>
    `,
  }),
});

/**
 * Simple overide for the default header
 */
export const Default:Story = createStory(
  'stacked',
  `<h1>This is a new header</h1>`
);

/**
 * Show the variant property
 */
export const ShowVariant:Story = createStory(
  'stacked',
  `<template v-slot="{variant}"><h1>This is a new header <br>variant = {{variant}}</h1></template>`
);

/**
 * Override all header contents, don't use the header class
 */
export const OverrideStyle:Story = createStory(
  'sidebar',
  `<template #wrapper><div><h1>Override the full style</h1></div></template>`
);

// <div :class="`pz-page-header ${variant}`">
// <slot :variant="variant">
//     <h1>PrezUI<br/><small><em>({{ variant }})</em></small></h1>
// </slot>
// </div>

