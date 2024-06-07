import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import { node, literal } from "prez-lib"
import PrezUIDataList from "../components/PrezUIDataList.vue";
import PrezUIDataItem from "../components/PrezUIDataItem.vue";
import PrezDataProvider from "../components/PrezDataProvider.vue";

const meta = {
    title: "PrezDataProviders",
    component: { PrezDataProvider, PrezUIDataList, PrezUIDataItem },
    tags: ["autodocs"],
    argTypes: {
        url: { description: "The URL endpoint" },
        objectId: { description: "Object ID for object lookups"}
    }
};// satisfies Meta<typeof PrezDataListProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const TemplateList = (args, { argTypes }) => ({
    components: { PrezDataProvider, PrezUIDataList },
    props: Object.keys(argTypes),
    template: `
      <PrezDataProvider type="list" :url="args.url">
        <template v-slot="{ data }">
            <PrezUIDataList :data="data" />
        </template>
      </PrezDataProvider>
    `,
    setup() {
        return { args };
    }
});

export const CatalogList: Story = TemplateList.bind({});
CatalogList.args = {
    url: 'https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs'
};

export const VocabList: Story = TemplateList.bind({});
VocabList.args = {
    url: 'https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs/bblck-ctlg:bblocks/collections'
};


const TemplateItem = (args, { argTypes }) => ({
    components: { PrezDataProvider, PrezUIDataItem, PrezUIDataList },
    props: Object.keys(argTypes),
    template: `
      <PrezDataProvider type="object" :url="args.url" :objectId="args.objectId">
        <template v-slot="{ data }">
            <PrezUIDataItem :data="data" />
        </template>
      </PrezDataProvider>
    `,
    setup() {
        return { args };
    }
});


export const CatalogItem: Story = TemplateItem.bind({});
CatalogItem.args = {
    url: 'https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs/bblck-ctlg:bblocks',
    objectId: 'bblck-ctlg:bblocks'
};

// Default.decorators = [
//     vueRouter()
// ];
