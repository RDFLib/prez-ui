import type { Meta, StoryObj } from "@storybook/vue3";
import { literal, node } from "prez-lib"
import PrezUILiteral from "../components/PrezUILiteral.vue";

const meta = {
    title: "PrezUILiteral",
    component: PrezUILiteral,
    tags: ["autodocs"],
    argTypes: {
        value: { description: "The literal string", type: "string" },
        datatype: { description: "The datatype of the literal", },
        language: { description: "The language code of the literal (following the IETF BCP 47 language codes)", type: "string" },
        isGeometry: { description: "A flag to indicate whether a literal is a geometry string", type: "boolean" },
        termType: { table: { disable: true } }
    },
} satisfies Meta<typeof PrezUILiteral>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: literal("Literal"),
};

export const Language: Story = {
    args: literal({ value: "English Literal", language: "en" }),
};

export const Datatype: Story = {
    args: literal({
        value: "https://example.com/Literal2",
        datatype: node({
            value: "http://www.w3.org/2001/XMLSchema#anyURI",
            curie: "xsd:anyURI"
        })
    }),
};

export const Geometry: Story = {
    args: {
        ...literal({
            value: "POINT((22 22))",
            datatype: node({
                value: "http://www.opengis.net/ont/geosparql#asWKT",
                curie: "geo:asWKT",
                label: literal({
                    value: "As WKT",
                    language: "en",
                }),
                description: literal({
                    value: "A description for asWKT",
                    language: "en",
                })
            })
        }),
        isGeometry: true
    },
};
