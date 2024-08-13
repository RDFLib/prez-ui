import type { Meta, StoryObj } from "@storybook/vue3";
import PrezUIDataPage from "@/components/PrezUIDataPage.vue";

/**
 * Data pages render a page with data elements given a URL and page type.
 * It calls the data provider and other data renderers
 * 
 */
const meta = {
  title: "Data Fetching/PrezUIDataPage",
  component: PrezUIDataPage,
  tags: ["autodocs"],
  argTypes: {
  },
} satisfies Meta<typeof PrezUIDataPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DataPageItem: Story = {
  args: {
    type: 'item',
    url: "https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs/exds:sandgate"
  }
}

export const DataPageItemWithConceptScheme: Story = {
  args: {
    type: 'item',
    url: "https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs/exm:SchemingConceptScheme"
  }
}

export const DataPageList: Story = {
  args: {
    type: 'list',
    url: "https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com/catalogs"
  }
}