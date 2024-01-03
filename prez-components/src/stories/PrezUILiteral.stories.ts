import type { Meta, StoryObj } from "@storybook/vue3";
import { literalLang, literalDatatype, literalGeom } from "../util/storyData";
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
        rdfType: { table: { disable: true } }
    },
} satisfies Meta<typeof PrezUILiteral>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        value: "Literal",
        rdfType: "literal"
    },
};

export const Language: Story = {
    args: literalLang,
};

export const Datatype: Story = {
    args: literalDatatype,
};

export const Geometry: Story = {
    args: literalGeom,
};
