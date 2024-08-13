import type { Meta, StoryObj } from "@storybook/vue3";
import { node, literal } from "prez-lib";
import { type Component, type ComponentOptions } from "vue";
import PrezUIStaticPage from "@/components/PrezUIStaticPage.vue";

/**
 * The static page component renders a template wrapped in the
 * standard Prez header and footer object
 * 
 * 
 */
const meta = {
  title: "Page Components/PrezUIStaticPage",
  component: PrezUIStaticPage,
  tags: ["autodocs"],
  argTypes: {
//    url: { type: "string" }
  },
} satisfies Meta<typeof PrezUIStaticPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Define a type for the components parameter
type Components = Record<string, Component | ComponentOptions>;

// Infer args type from component's prop types
type Args = Story['args'];

// Story generator function
const createStory = (args:Args, components:Components, templateContent: string): Story => ({
  args,
  render: (args) => ({
    components,
    setup() {
      return { args };
    },
    template: `
      <PrezUIStaticPage :variant="args.variant" :url="args.url">
        ${templateContent}
      </PrezUIDataProvider>
    `,
  }),
});

export const ExampleStaticPage:Story = createStory({variant: 'stacked'}, { PrezUIStaticPage }, `
    <h1>My static page</h1>
    This is a static bit of content passed into the default slot.
    <p>Use this component to create a page that fits in with the rest of the site.</p>
`)

export const ExampleAboutPage:Story = createStory({variant: 'sidebar'}, { PrezUIStaticPage }, `
    <h1>Example about page</h1>
    <em>Will demonstrate sidebar layout...</em>
    <pre>
Prez is an open source an Application Programming Interface (API) that implements Linked Data methods for 
providing access to a wide range of data on the web. It also implements the OGC API:Features for spatial data.

Prez comes in a number of "flavours", one or more of which may be implemented in any one Prez system:

CatPrez - for presenting data catalog information
SpacePrez - for presenting spatial data
VocPrez - for presenting vocabularies
Each enabled flavour will have links to its home page in the main menu.    
    </pre>
`)


