import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";

import PrezUITerm from "../components/PrezUITerm.vue";
import { PrezDataFactory } from 'prez-lib';

const meta = {
    title: "PrezUITerm",
    component: PrezUITerm,
    tags: ["autodocs"],
    argTypes: {
        term: { description: "An example literal term" }
    }
} satisfies Meta<typeof PrezUITerm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        term: PrezDataFactory.prezLiteral("I'm basically literal")
    }
};

export const LiteralLanguage: Story = {
    args: {
        term: PrezDataFactory.prezLiteral({text: "I'm basically illiteral", language: "nz"})
    }
};

export const LiteralDataTypeURI: Story = {
    args: {
        term: PrezDataFactory.prezLiteral({text: "I'm basically literal", dataType: PrezDataFactory.prezNode('http://www.w3.org/2001/XMLSchema#string')})
    }
};

export const LiteralDataTypeCurie: Story = {
    args: {
        term: PrezDataFactory.prezLiteral({text: "I'm basically literal", dataType: PrezDataFactory.prezNode({uri: 'http://www.w3.org/2001/XMLSchema#string', curie: 'xsd:string'})})
    }
};

export const LiteralDataTypeLabel: Story = {
    args: {
        term: PrezDataFactory.prezLiteral({text: "I'm basically literal", dataType: PrezDataFactory.prezNode({uri: 'http://www.w3.org/2001/XMLSchema#string', label: 'String'})})
    }
};

export const LiteralDataTypeCurieLabel: Story = {
    args: {
        term: PrezDataFactory.prezLiteral({text: "I'm basically literal", dataType: PrezDataFactory.prezNode({uri: 'http://www.w3.org/2001/XMLSchema#string', curie: 'xsd:string', label: 'String'})})
    }
};

export const LiteralDataTypeDescription: Story = {
    args: {
        term: PrezDataFactory.prezLiteral({text: "I'm basically literal", dataType: PrezDataFactory.prezNode({uri: 'http://xsd.org/string', description: 'The string datatype represents character strings in XML. The ·value space· of string is the set of finite-length sequences of characters (as defined in [XML 1.0 (Second Edition)]) that ·match· the Char production from [XML 1.0 (Second Edition)]. A character is an atomic unit of communication; it is not further specified except to note that every character has a corresponding Universal Character Set code point, which is an integer.'})})
    }
};

export const LiteralDataTypeCurieDescription: Story = {
    args: {
        term: PrezDataFactory.prezLiteral({text: "I'm basically literal", dataType: PrezDataFactory.prezNode({uri: 'http://xsd.org/string', curie: 'xsd:string', description: 'The string datatype represents character strings in XML. The ·value space· of string is the set of finite-length sequences of characters (as defined in [XML 1.0 (Second Edition)]) that ·match· the Char production from [XML 1.0 (Second Edition)]. A character is an atomic unit of communication; it is not further specified except to note that every character has a corresponding Universal Character Set code point, which is an integer.'})})
    }
};

export const LiteralDataTypeLabelDescription: Story = {
    args: {
        term: PrezDataFactory.prezLiteral({text: "I'm basically literal", dataType: PrezDataFactory.prezNode({uri: 'http://xsd.org/string', label: 'String', description: 'The string datatype represents character strings in XML. The ·value space· of string is the set of finite-length sequences of characters (as defined in [XML 1.0 (Second Edition)]) that ·match· the Char production from [XML 1.0 (Second Edition)]. A character is an atomic unit of communication; it is not further specified except to note that every character has a corresponding Universal Character Set code point, which is an integer.'})})
    }
};

export const LiteralDataTypeCurieLabelDescription: Story = {
    args: {
        term: PrezDataFactory.prezLiteral({text: "I'm basically literal", dataType: PrezDataFactory.prezNode({uri: 'http://xsd.org/string', curie: 'xsd:string', label: 'String', description: 'The string datatype represents character strings in XML. The ·value space· of string is the set of finite-length sequences of characters (as defined in [XML 1.0 (Second Edition)]) that ·match· the Char production from [XML 1.0 (Second Edition)]. A character is an atomic unit of communication; it is not further specified except to note that every character has a corresponding Universal Character Set code point, which is an integer.'})})
    }
};

export const NodeURI: Story = {
    args: {
        term: PrezDataFactory.prezNode("http://abc.com")
    }
};

export const NodeCurie: Story = {
    args: {
        term: PrezDataFactory.prezNode( {uri: "http://abc.com/fred", curie: "abc:fred"})
    }
};

export const NodeLabel: Story = {
    args: {
        term: PrezDataFactory.prezNode({uri: "http://abc.com/fred", label: "ABC"})
    }
};

export const NodeCurieLabel: Story = {
    args: {
        term: PrezDataFactory.prezNode({uri: "http://abc.com/fred", curie: "abc:fred", label: "ABC"})
    }
};

export const NodeDescription: Story = {
    args: {
        term: PrezDataFactory.prezNode({uri: "http://abc.com/fred", description: "The ABC Shop"})
    }
};

export const NodeCurieDescription: Story = {
    args: {
        term: PrezDataFactory.prezNode({uri: "http://abc.com/fred", curie: "abc:fred", description: "The ABC Shop"})
    }
};

export const NodeCurieDescriptionLabel: Story = {
    args: {
        term: PrezDataFactory.prezNode(
            {
                uri: "http://abc.com/fred", 
                curie: "abc:fred", 
                label: PrezDataFactory.prezLiteral('ABC'), 
                description: PrezDataFactory.prezLiteral("The ABC Shop")
            })
    }
};

Default.decorators = [
    vueRouter()
];
