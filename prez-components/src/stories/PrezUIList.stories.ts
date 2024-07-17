import type { Meta, StoryObj } from "@storybook/vue3";
import PrezUIList from "../components/PrezUIList.vue";
import { type PrezItem, type PrezList, type PrezProperties, literal, node } from "prez-lib";
import { compile } from 'handlebars';

/**
 * Displays a list of Prez items
 */
const meta = {
  title: "Data Components/PrezUIList",
  component: PrezUIList,
  tags: ["autodocs"],
  argTypes: {
    list: { description: 'list stuff'}
  }
} satisfies Meta<typeof PrezUIList>;

export default meta;
type Story = StoryObj<typeof meta>;

const tpl = {
    pred: compile("http://pred.com/{{name}}"),
    uri: compile("https://example.com/{{uri}}"),
    desc: compile("This is a description of {{name}}"),
};

const row = (params:{uri:string, name:string, props:{name: string, val: string}[]}) => {
    const p:PrezProperties = {};
    for(const key of Object.keys(params.props)) {
        const prop = params.props[key];
        p[tpl.pred(prop)] = { predicate: node({value: tpl.pred(prop), label: prop.name}), objects: [literal(prop.val)] };
    }
    return {
        focusNode: node({value: tpl.uri(params), label: literal(params.name), description: literal(tpl.desc(params))}),
        properties: p
    } as PrezItem;
}

const rowi = (i) => row({uri: i.toString(), name: 'Item ' + i, 
    props: [{name: 'Publisher', val: "Fred " + i}, {name: 'Creator', val: 'Sam ' + i}]})

const listData:PrezList = Array.from({ length: 20 }, (_, i) => rowi(i + 1));

export const Default: Story = {
  args: {
    list: listData
  }
};
