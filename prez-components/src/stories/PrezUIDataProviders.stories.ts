import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import { node, literal } from "prez-lib";
import PrezUIData from "../components/PrezUIData.vue";
import PrezUIDataProvider from "../components/PrezUIDataProvider.vue";
import PrezUIPropertyTable from '../components/PrezUIPropertyTable.vue';
import PrezUIList from "../components/PrezUIList.vue";
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
  components: { PrezUIDataProvider, PrezUIHeader, PrezUIData, PrezUIPropertyTable },
  props: Object.keys(argTypes),
  template: `
      <PrezUIDataProvider :type="args.type" :url="args.url">
        <template v-slot="{ data: { data } }">
            <PrezUIHeader v-if="data.focusNode"  :term="data.focusNode" />
            <PrezUIPropertyTable v-if="data.focusNode" :term="data.focusNode" :properties="data.properties" />
        </template>
      </PrezUIDataProvider>
      `,
  setup() {
    return { args };
  },
});

const TemplateList = (args, { argTypes }) => ({
  components: { PrezUIDataProvider, PrezUIList },
  props: Object.keys(argTypes),
  template: `
      <PrezUIDataProvider :type="args.type" :url="args.url">
        <template v-slot="{ data: { data } }">
          <PrezUIList :list="data" />
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
        <template v-slot="{ data }">
          <PrezUIProfiles :profiles="data.profiles" />
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

