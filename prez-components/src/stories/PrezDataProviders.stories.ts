import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import { node, literal } from "prez-lib";
import PrezUIItem from "../components/PrezUIItem.vue";
//import PrezUIDataList from "../components/PrezUIDataList.vue";
//import PrezUIDataItem from "../components/PrezUIDataItem.vue";
import PrezDataProvider from "../components/PrezDataProvider.vue";
//import PrezUIObjectTable from '../components/PrezUIObjectTable.vue';
//import PrezUIBlankNode from "../components/PrezUIBlankNode.vue";

const meta = {
    title: "Templates/PrezDataProvider",
    component: { PrezDataProvider, PrezUIItem },
    tags: ["autodocs"],
    argTypes: {
        url: { description: "The URL endpoint", type: 'string' },
        debug: { description: "Show debug info", type: 'boolean'}
    }
};// satisfies Meta<typeof PrezDataListProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const TemplateItem = (args, { argTypes }) => ({
    components: { PrezDataProvider, PrezUIItem },
    props: Object.keys(argTypes),
    template: `
      <PrezDataProvider type="item" :debug="args.debug" :url="args.url">
        <template v-slot="{ data, debug }">
            <PrezUIItem :debug="debug" :item="data" />
        </template>
      </PrezDataProvider>
    `,
    setup() {
        return { args };
    }
});

const files = [
    'atomic-00-literal-no-label.json',
    'atomic-01-literal-plain-label.json',
    'atomic-02-literal-label-language.json',
    'atomic-03-literal-label-datatype-labeled.json',
    'atomic-04-literal-label-datatype-unlabeled.json',
    'atomic-05-lit-dtype-curie-desc.json',
    'atomic-05-node-uri.json',
    'atomic-06-node-curie.json',
    'atomic-07-annotation-label.json',
    'atomic-08-annotation-desc.json',
    'atomic-09-annotation-prov.json',
    'atomic-10-annotation-label-desc.json',
    'atomic-11-annotation-label-desc-prov.json',
    'atomic-12-link.json',
    'atomic-13-members.json',
    'atomic-14-blank-node-labeled-predicates.json',
    'atomic-15-blank-node-unlabeled-predicates.json',
    'composite-00-object.json',
    'composite-01-list-props.json',
    'composite-02-list-no-props.json',
    'composite-03-concept-hierarchy-narrowers.json',
    'composite-04-concept-hierarchy-object.json',
    'composite-05-concept-hierarchy-top-concepts.json'
];

function s(file) {
    const name = file.replace(/\-/g, '');
    const s: Story = TemplateItem.bind({});
    s.storyName = file;
    s.args = { url: `/test/data/${file}`};
    return s;
}


const LiteralNoLabel = s('atomic-00-literal-no-label.json');
const LiteralPlainLabel = s('atomic-01-literal-plain-label.json');
const LiteralLabelLanguage = s('atomic-02-literal-label-language.json');
const LiteralLabelDatatypeLabel = s('atomic-03-literal-label-datatype-labeled.json');
const LiteralLabelDatatypeNoLabel = s('atomic-04-literal-label-datatype-unlabeled.json');
const CompositeObject = s('composite-00-object.json');
// 'atomic-05-lit-dtype-curie-desc.json',
// 'atomic-05-node-uri.json',
// 'atomic-06-node-curie.json',
// 'atomic-07-annotation-label.json',
// 'atomic-08-annotation-desc.json',
// 'atomic-09-annotation-prov.json',
// 'atomic-10-annotation-label-desc.json',
// 'atomic-11-annotation-label-desc-prov.json',
// 'atomic-12-link.json',
// 'atomic-13-members.json',
// 'atomic-14-blank-node-labeled-predicates.json',
// 'atomic-15-blank-node-unlabeled-predicates.json',
// 'composite-00-object.json',
// 'composite-01-list-props.json',
// 'composite-02-list-no-props.json',
// 'composite-03-concept-hierarchy-narrowers.json',
// 'composite-04-concept-hierarchy-object.json',
// 'composite-05-concept-hierarchy-top-concepts.json'

export { 
    CompositeObject,
    LiteralLabelDatatypeLabel, 
    LiteralLabelDatatypeNoLabel, 
    LiteralLabelLanguage, 
    LiteralNoLabel, 
    LiteralPlainLabel
}

// Default.decorators = [
//     vueRouter()
// ];

