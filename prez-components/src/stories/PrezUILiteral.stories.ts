import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";

import PrezUILiteral from "../components/PrezUILiteral.vue";
import { literal, node } from "prez-lib";

const meta = {
  title: "Data Components/PrezUILiteral",
  component: PrezUILiteral,
  tags: ["autodocs"],
  argTypes: {
    term: { description: "An example literal term" },
  },
} satisfies Meta<typeof PrezUILiteral>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    term: literal("This is a string literal"),
  },
};

export const WithLanguage: Story = {
  args: {
    term: literal({ value: "A string literal with language", language: "nz" }),
  },
};

export const WithDatatypeURI: Story = {
  args: {
    term: literal({
      value: "This is a string literal",
      datatype: node("http://www.w3.org/2001/XMLSchema#string"),
    }),
  },
};

export const WithDatatypeCurie: Story = {
  args: {
    term: literal({
      value: "This is a string literal",
      datatype: node({
        value: "http://www.w3.org/2001/XMLSchema#string",
        curie: "xsd:string",
      }),
    }),
  },
};

export const WithDatatypeLabel: Story = {
  args: {
    term: literal({
      value: "This is a string literal",
      datatype: node({
        value: "http://www.w3.org/2001/XMLSchema#string",
        label: literal("String"),
      }),
    }),
  },
};

export const WithDatatypeCurieLabel: Story = {
  args: {
    term: literal({
      value: "This is a string literal",
      datatype: node({
        value: "http://www.w3.org/2001/XMLSchema#string",
        curie: "xsd:string",
        label: literal("String"),
      }),
    }),
  },
};

export const WithDatatypeDescription: Story = {
  args: {
    term: literal({
      value: "This is a string literal",
      datatype: node({
        value: "http://xsd.org/string",
        description: literal(
          "The string datatype represents character strings in XML. The ·value space· of string is the set of finite-length sequences of characters (as defined in [XML 1.0 (Second Edition)]) that ·match· the Char production from [XML 1.0 (Second Edition)]. A character is an atomic unit of communication; it is not further specified except to note that every character has a corresponding Universal Character Set code point, which is an integer.",
        ),
      }),
    }),
  },
};

export const WithDatatypeCurieDescription: Story = {
  args: {
    term: literal({
      value: "This is a string literal",
      datatype: node({
        value: "http://xsd.org/string",
        curie: "xsd:string",
        description: literal(
          "The string datatype represents character strings in XML. The ·value space· of string is the set of finite-length sequences of characters (as defined in [XML 1.0 (Second Edition)]) that ·match· the Char production from [XML 1.0 (Second Edition)]. A character is an atomic unit of communication; it is not further specified except to note that every character has a corresponding Universal Character Set code point, which is an integer.",
        ),
      }),
    }),
  },
};

export const WithDatatypeLabelDescription: Story = {
  args: {
    term: literal({
      value: "This is a string literal",
      datatype: node({
        value: "http://xsd.org/string",
        label: literal("String"),
        description: literal(
          "The string datatype represents character strings in XML. The ·value space· of string is the set of finite-length sequences of characters (as defined in [XML 1.0 (Second Edition)]) that ·match· the Char production from [XML 1.0 (Second Edition)]. A character is an atomic unit of communication; it is not further specified except to note that every character has a corresponding Universal Character Set code point, which is an integer.",
        ),
      }),
    }),
  },
};

export const WithDatatypeCurieLabelDescription: Story = {
  args: {
    term: literal({
      value: "This is a string literal",
      datatype: node({
        value: "http://xsd.org/string",
        curie: "xsd:string",
        label: literal("String"),
        description: literal(
          "The string datatype represents character strings in XML. The ·value space· of string is the set of finite-length sequences of characters (as defined in [XML 1.0 (Second Edition)]) that ·match· the Char production from [XML 1.0 (Second Edition)]. A character is an atomic unit of communication; it is not further specified except to note that every character has a corresponding Universal Character Set code point, which is an integer.",
        ),
      }),
    }),
  },
};

Default.decorators = [vueRouter()];
