import type { Meta, StoryObj } from "@storybook/vue3";
import { type Component, type ComponentOptions } from "vue";
import Button from 'primevue/button';
import PrezUIDataProvider from '@/components/PrezUIDataProvider.vue';
import PrezUIItemTable from '@/components/PrezUIItemTable.vue';
import PrezUIItemList from '@/components/PrezUIItemList.vue';
import PrezUIHeader from '@/components/PrezUIHeader.vue';
import PrezUIProfiles from '@/components/PrezUIProfiles.vue';
import PrezUIDataConcept from "@/components/PrezUIDataConcept.vue";

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
      <PrezUIDataProvider :type="args.type" :url="args.url">
        ${templateContent}
      </PrezUIDataProvider>
    `,
  }),
});

const baseUrl = 'https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com';


export const DataItem:Story = createStory({type: 'item', url: baseUrl + '/catalogs/exds:sandgate'}, { Button, PrezUIDataProvider, PrezUIHeader, PrezUIItemTable }, `
        <template v-slot="{ item }">
            <PrezUIHeader :term="item" />
            <PrezUIItemTable :term="item" :properties="item.properties" />
        </template>
  `)

export const DataItemLowerLevel:Story = createStory({type: 'item', url: baseUrl + '/catalogs/exds:sandgate/collections/sndgt:floods/items/sndgt:f332'}, { PrezUIDataProvider, PrezUIHeader, PrezUIItemTable }, 
  `
        <template v-slot="{ item }">
            <PrezUIHeader :term="item" />
            <PrezUIItemTable :term="item" :properties="item.properties" />
        </template>
  `)

export const DataList:Story = createStory({type: 'list', url: baseUrl + '/catalogs'}, { PrezUIDataProvider, PrezUIItemList },
  `
      <PrezUIDataProvider :type="args.type" :url="args.url">
        <template v-slot="{ list }">
          <PrezUIItemList :list="list" />
        </template>
      </PrezUIDataProvider>
  `
);

export const DataProfiles:Story = createStory({type: 'item', url: baseUrl + '/catalogs/exds:sandgate'}, { PrezUIDataProvider, PrezUIProfiles},
  `
      <PrezUIDataProvider :type="args.type" :url="args.url">
        <template v-slot="{ profiles }">
          <PrezUIProfiles :profiles="profiles" />
        </template>
      </PrezUIDataProvider>
  `
);


export const DataItemConcepts:Story = createStory({type: 'list', url: baseUrl + '/concept-hierarchy/exm:SchemingConceptScheme/top-concepts'}, { PrezUIDataConcept }, 
  `
    <PrezUIDataConcept :url="args.url" :concepts="concepts" />
  `)
