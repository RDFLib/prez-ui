import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import { node, literal } from "prez-lib";
import PrezUIDataProvider from "../components/PrezUIDataProvider.vue";
import PrezUIItemTable from '../components/PrezUIItemTable.vue';
import PrezUIItemList from "../components/PrezUIItemList.vue";
import PrezUIHeader from "../components/PrezUIHeader.vue";
import PrezUIProfiles from "../components/PrezUIProfiles.vue";

/**
 * Data providers retrieve RDF data from a URL, then processes it into 
 * a PrezData variant structure, read for rendering.
 * 
 * ## Example
 * 
 * ```mermaid
 * A-->B
 * ```
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

const TemplateItem = (args, { argTypes }) => ({
  components: { PrezUIDataProvider, PrezUIHeader, PrezUIItemTable },
  props: Object.keys(argTypes),
  template: `
      <PrezUIDataProvider :type="args.type" :url="args.url">
        <template v-slot="{ item }">
            <PrezUIHeader :term="item" />
            <PrezUIItemTable :term="item" :properties="item.properties" />
        </template>
      </PrezUIDataProvider>
      `,
  setup() {
    return { args };
  },
});

const TemplateList = (args, { argTypes }) => ({
  components: { PrezUIDataProvider, PrezUIItemList },
  props: Object.keys(argTypes),
  template: `
      <PrezUIDataProvider :type="args.type" :url="args.url">
        <template v-slot="{ list }">
          <PrezUIItemList :list="list" />
        </template>
      </PrezUIDataProvider>
      `,
  setup() {
    return { args };
  },
});

const TemplateProfiles = (args, { argTypes }) => ({
  components: { PrezUIDataProvider, PrezUIProfiles },
  props: Object.keys(argTypes),
  template: `
      <PrezUIDataProvider :type="'item'" :url="args.url">
        <template v-slot="{ profiles }">
          <PrezUIProfiles :profiles="profiles" />
        </template>
      </PrezUIDataProvider>
      `,
  setup() {
    return { args };
  },
});


function s(type, url) {
  const s: Story = TemplateItem.bind({});
  s.args = { type, url };
  return s;
}

export const DataItem:Story = TemplateItem.bind({});
DataItem.args = {type: 'item', url: "https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs/exds:sandgate"};

export const DataList = TemplateList.bind({});
DataList.args = {type: 'list', url: "https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs"};

export const DataProfiles = TemplateProfiles.bind({});
DataProfiles.args = {type: 'item', url: "https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs/exds:sandgate"};

//https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs/exds:sandgate/collections/sndgt:floods/items/sndgt:f332

