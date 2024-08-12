import type { Meta, StoryObj } from "@storybook/vue3";
import PrezUIItemTable from "../components/PrezUIItemTable.vue";
import { type PrezProperties, literal, node, type PrezFocusNode } from "prez-lib";
import { compile } from 'handlebars';

/**
 * Displays an focus node and it's properties in a table
 */
const meta = {
  title: "Data Components/PrezUIItemTable",
  component: PrezUIItemTable,
  tags: ["autodocs"],
  argTypes: {
  }
} satisfies Meta<typeof PrezUIItemTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const tpl = {
    pred: compile("http://pred.com/{{name}}"),
    uri: compile("https://example.com/{{uri}}"),
    desc: compile("This is a description of {{name}}"),
};

const row = (params:{uri:string, name:string, props:{name: string, val: string}[]}) => {
    const p:PrezProperties = {};
    for(const prop of params.props) {
        p[tpl.pred(prop)] = { predicate: node({value: tpl.pred(prop), label: literal(prop.name)}), objects: [literal(prop.val)] };
    }
    return {
        ...node({value: tpl.uri(params), label: literal(params.name), description: literal(tpl.desc(params))}),
        properties: p
    } as PrezFocusNode;
}

const rowi = (i:number) => row({uri: i.toString(), name: 'Item ' + i, 
    props: [{name: 'Publisher', val: "Fred " + i}, {name: 'Creator', val: 'Sam ' + i}]})

const itemData:PrezFocusNode = rowi(1);

export const Default: Story = {
  args: {
    term: itemData
  }
};
