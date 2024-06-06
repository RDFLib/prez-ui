import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import { node, literal } from "prez-lib"
import PrezUIList from "../components/PrezUIList.vue";
import PrezDataListProvider from "../components/PrezDataListProvider.vue";

const meta = {
    title: "PrezDataProviders",
    component: { PrezDataListProvider, PrezUIList },
    tags: ["autodocs"],
    argTypes: {
        url: { description: "The URL endpoint" },
    }    
};// satisfies Meta<typeof PrezDataListProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        url: 'http://test.com'
    }
};

// const Template = (args, { argTypes }) => ({
//     components: { PrezDataListProvider, PrezUIList },
//     setup() {
//       return { args };
//     }
// });

// Fix the template to be a functional story
const Template = (args, { argTypes }) => ({
    components: { PrezDataListProvider, PrezUIList },
    props: Object.keys(argTypes),
    template: `
      <PrezDataListProvider :url="args.url">
        <template v-slot="{ data }">
            <PrezUIList :data="data" />
        </template>
      </PrezDataListProvider>
    `,
    setup() {
        return { args };
    }
});

export const TemplateStory: Story = Template.bind({});
TemplateStory.args = {
    url: 'https://api.gswa.dev.kurrawong.ai/v/vocab'
};
// Default.decorators = [
//     vueRouter()
// ];
