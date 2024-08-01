import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import { node, literal } from "prez-lib";
import Button from 'primevue/button';
import { PrezUIDataProvider, PrezUIItemTable, PrezUIItemList, PrezUIHeader, PrezUIProfiles, PrezUIDataConcept } from "prez-components";

/**
 * Data providers retrieve RDF data from a URL, then processes it into 
 * a PrezData variant structure, read for rendering.
 * 
 * ## Example
 * 
 */
const meta = {
  title: "Data Fetching/PrezUIDataProvider",
  component: PrezUIDataProvider,
  tags: ["autodocs"],
  argTypes: {
//    url: { type: "string" }
  },
} satisfies Meta<typeof PrezUIDataProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story generator function
const createStory = (args, components, templateContent: string): Story => ({
  args,
  render: (args) => ({
    components,
    setup() {
      return { args };
    },
    template: `
      <PrezUIDataProvider :type="args.type" :url="args.url">
        ${templateContent}
      </PrezUIDataProvider>
    `,
  }),
});

const baseUrl = 'https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com';


export const DataItem = createStory({type: 'item', url: baseUrl + '/catalogs/exds:sandgate'}, { Button, PrezUIDataProvider, PrezUIHeader, PrezUIItemTable }, `
        <template v-slot="{ item }">
            <Button>MY BUTTON</Button>
            <h1>HEAD</h1>
            <PrezUIHeader :term="item" />
            <PrezUIItemTable :term="item" :properties="item.properties" />
        </template>
  `)

export const DataItemLowerLevel = createStory({type: 'item', url: baseUrl + '/catalogs/exds:sandgate/collections/sndgt:floods/items/sndgt:f332'}, { PrezUIDataProvider, PrezUIHeader, PrezUIItemTable }, 
  `
        <template v-slot="{ item }">
            <PrezUIHeader :term="item" />
            <PrezUIItemTable :term="item" :properties="item.properties" />
        </template>
  `)

export const DataList = createStory({type: 'list', url: baseUrl + '/catalogs'}, { PrezUIDataProvider, PrezUIItemList },
  `
      <PrezUIDataProvider :type="args.type" :url="args.url">
        <template v-slot="{ list }">
          <PrezUIItemList :list="list" />
        </template>
      </PrezUIDataProvider>
  `
);

export const DataProfiles = createStory({type: 'item', url: baseUrl + '/catalogs/exds:sandgate'}, { PrezUIDataProvider, PrezUIProfiles},
  `
      <PrezUIDataProvider :type="args.type" :url="args.url">
        <template v-slot="{ profiles }">
          <PrezUIProfiles :profiles="profiles" />
        </template>
      </PrezUIDataProvider>
  `
);


export const DataItemConcepts = createStory({type: 'list', url: baseUrl + '/concept-hierarchy/exm:SchemingConceptScheme/top-concepts'}, { PrezUIDataConcept }, 
  `
    <PrezUIDataConcept :url="args.url" :concepts="concepts" />
  `)
