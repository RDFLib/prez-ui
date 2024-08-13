import type { Meta, StoryObj } from "@storybook/vue3";
import PrezUIItemList from "@/components/PrezUIItemList.vue";
import { type PrezProperties, literal, node, type PrezFocusNode } from "prez-lib";

/**
 * Displays a list of Prez items
 */
const meta: Meta<typeof PrezUIItemList> = {
  title: "Data Components/PrezUIItemList",
  component: PrezUIItemList,
  tags: ["autodocs"],
  argTypes: {
    // Define any argTypes if needed
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

// Template functions using string interpolation
const tpl = {
  pred: (name: string) => `http://pred.com/${name}`,
  uri: (uri: string) => `https://example.com/${uri}`,
  desc: (name: string) => `This is a description of ${name}`,
};

// Function to create a row
const row = (params: { uri: string; name: string; props: { name: string; val: string }[] }): PrezFocusNode => {
  const p: PrezProperties = {};
  for (const prop of params.props) {
    const predicateValue = tpl.pred(prop.name);
    p[predicateValue] = {
      predicate: node({
        value: predicateValue,
        label: literal(prop.name)
      }),
      objects: [literal(prop.val)]
    };
  }
  return {
    ...node({
      value: tpl.uri(params.uri),
      label: literal(params.name),
      description: literal(tpl.desc(params.name))
    }),
    properties: p
  };
};

// Function to create rows with indices
const rowi = (i: number) => row({
  uri: i.toString(),
  name: `Item ${i}`,
  props: [
    { name: "Publisher", val: `Fred ${i}` },
    { name: "Creator", val: `Sam ${i}` }
  ]
});

// Generate list data
const listData: PrezFocusNode[] = Array.from({ length: 20 }, (_, i) => rowi(i + 1));

// Default Story
export const Default: Story = {
  args: {
    list: listData
  }
};
