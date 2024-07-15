import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import { node, literal } from "prez-lib";
import PrezUIData from "../components/PrezUIData.vue";
import PrezDataProvider from "../components/PrezDataProvider.vue";

const meta = {
  title: "Containers/PrezDataProvider",
  component: { PrezDataProvider, PrezUIData },
  tags: ["autodocs"],
  argTypes: {
    url: { description: "The URL endpoint", type: "string" },
    debug: { description: "Show debug info", type: "boolean" },
  },
}; // satisfies Meta<typeof PrezDataListProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const TemplateItem = (args, { argTypes }) => ({
  components: { PrezDataProvider, PrezUIData },
  props: Object.keys(argTypes),
  template: `
      <PrezDataProvider type="item" :debug="args.debug" :url="args.url">
        <template v-slot="{ data, debug }">
            <PrezUIData :debug="debug" :data="data" />
        </template>
      </PrezDataProvider>
    `,
  setup() {
    return { args };
  },
});

function s(file) {
  const name = file.replace(/\-/g, "");
  const s: Story = TemplateItem.bind({});
  s.storyName = file;
  s.args = { url: `/test/data/${file}` };
  return s;
}

const CompositeObject = s("composite-00-object.json");
const ListObject = s("composite-01-list-props.json");

export {
  CompositeObject,
  ListObject
};

// Default.decorators = [
//     vueRouter()
// ];
