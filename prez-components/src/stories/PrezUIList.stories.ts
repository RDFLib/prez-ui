import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import { node, literal } from "prez-lib"
import PrezUIList from "../components/PrezUIList.vue";

const meta = {
    title: "PrezUIList",
    component: PrezUIList,
    tags: ["autodocs"],
    argTypes: {
        data: { description: "The list of items" },
    },
} satisfies Meta<typeof PrezUIList>;

export default meta;
type Story = StoryObj<typeof meta>;

// export const Template: Story = (args, { argTypes }) => ({
//     components: { PrezUIList },
//     props: Object.keys(argTypes),
//     template: '<PrezDataListProvider url="http://abc.com"><PrezUIList ></PrezDataListProvider>',
//   });

// const creator = node({
//     value: "https://example.com/creator",
//     curie: "ex:creator",
//     label: literal("Creator"),
//     description: literal("A creator is ...")
// });

// const issued = node({
//     value: "https://example.com/issued",
//     curie: "ex:issued",
//     label: literal("Issued"),
//     description: literal("The issued date is when ...")
// });

// const publisher = node({
//     value: "https://example.com/publisher",
//     curie: "ex:publisher",
//     label: literal("Publisher"),
//     description: literal("A publisher is ...")
// });

// export const Default: Story = {
//     args: {
//         data: [
//             {
//                 focusNode: {
//                     ...node({
//                         value: "https://example.com/item1",
//                         label: literal("Item 1"),
//                         description: literal("This is a description of Item 1"),
//                         links: [{value: "/item1"}]
//                     }),
//                     members: [{ link: "/item1/members", label: "Members" }]
//                 },
//                 properties: {
//                     // [creator.value]: {
//                     //     predicate: creator,
//                     //     objects: []
//                     // }
//                 }
//             },
//             {
//                 focusNode: {
//                     ...node({
//                         value: "https://example.com/item2",
//                         label: literal("Item 2"),
//                         description: literal("This is a description of Item 2"),
//                         links: [{value: "/item2"}]
//                     }),
//                     members: [{ link: "/item2/members", label: "Members" }]
//                 },
//                 properties: {
//                     [issued.value]: {
//                         predicate: issued,
//                         objects: [literal("2024-02-19")]
//                     }
//                 }
//             },
//             {
//                 focusNode: {
//                     ...node({
//                         value: "https://example.com/item3",
//                         label: literal("Item 3"),
//                         description: literal("This is a description of Item 3"),
//                         links: [{value: "/item3"}]
//                     }),
//                     members: [{ link: "/item3/members", label: "Members" }]
//                 },
//                 properties: {
//                     // [publisher.value]: {
//                     //     predicate: publisher,
//                     //     objects: []
//                     // }
//                 }
//             }
//         ]
//     },
// }

// Default.decorators = [
//     vueRouter()
// ];
