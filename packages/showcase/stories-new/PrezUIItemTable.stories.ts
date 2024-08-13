import type { Meta, StoryObj } from "@storybook/vue3";
import PrezUIItemTable from "@/components/PrezUIItemTable.vue";
import { type PrezProperties, literal, node, type PrezFocusNode } from "prez-lib";

/**
 * Displays a focus node and its properties in a table
 */
const meta: Meta<typeof PrezUIItemTable> = {
  title: "Data Components/PrezUIItemTable",
  component: PrezUIItemTable,
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
        label: literal(prop.name),
      }),
      objects: [literal(prop.val)],
    };
  }
  return {
    ...node({
      value: tpl.uri(params.uri),
      label: literal(params.name),
      description: literal(tpl.desc(params.name)),
    }),
    properties: p,
  };
};

// Function to create a row with a specific index
const rowi = (i: number) =>
  row({
    uri: i.toString(),
    name: `Item ${i}`,
    props: [
      { name: "Publisher", val: `Fred ${i}` },
      { name: "Creator", val: `Sam ${i}` },
    ],
  });

// Generate item data
const itemData: PrezFocusNode = rowi(1);

// Default Story
export const Default: Story = {
  args: {
    term: itemData,
  },
};
