import type { Meta, StoryObj } from "@storybook/vue3";
import { vueRouter } from "storybook-vue3-router";
import wf from "../wireframes/PrezWireframes01.vue";

import DataTable from "primevue/datatable";

const meta = {
    title: "Wireframes",
    component: wf,
    tags: ["autodocs"],
    argTypes: {
        title: { description: 'Title to use', type: 'string'},
        sidePanel: { description: 'Show the side panel', type: 'boolean'},
        sidePanelSearch: { description: 'Show the search box', type: 'boolean'},
        sidePanelProfile: { description: 'Show the profile selector', type: 'boolean'},
        pageType: { description: 'List, item or search page', type: 'string', control: 'radio', options: ['list', 'item', 'search']},
        showMap: { description: 'Show the map component', type: 'boolean'}
    }
} satisfies Meta<typeof wf>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ListingPage: Story = {
    args: {
        title: 'Catalog collection',
        sidePanel: false,
        sidePanelSearch: true,
        sidePanelProfile: true,
        showMap: false,
        pageType: 'list'
    }
}

export const ListingPageWithSidePanel: Story = {
    args: {
        title: 'Catalog collection',
        sidePanel: true,
        sidePanelSearch: true,
        sidePanelProfile: true,
        showMap: false,
        pageType: 'list'
    }
}

export const ListingPageWithMap: Story = {
    args: {
        title: 'Catalog collection',
        sidePanel: false,
        sidePanelSearch: true,
        sidePanelProfile: true,
        showMap: true,
        pageType: 'list'
    }
}

export const ListingPageWithMapAndSidePanel: Story = {
    args: {
        title: 'Catalog collection',
        sidePanel: true,
        sidePanelSearch: true,
        sidePanelProfile: true,
        showMap: true,
        pageType: 'list'
    }
}

export const ItemPage: Story = {
    args: {
        title: 'A catalog of Building Block Vocabularies',
        sidePanel: false,
        sidePanelSearch: true,
        sidePanelProfile: true,
        showMap: false,
        pageType: 'item'
    }
}
// include hierarchy, embedded form

export const ItemPageWithMap: Story = {
    args: {
        title: 'A catalog of Building Block Vocabularies',
        sidePanel: false,
        sidePanelSearch: true,
        sidePanelProfile: true,
        showMap: true,
        pageType: 'item'
    }
}

export const ItemPageWithPanelAndMap: Story = {
    args: {
        title: 'A catalog of Building Block Vocabularies',
        sidePanel: true,
        sidePanelSearch: true,
        sidePanelProfile: true,
        showMap: true,
        pageType: 'item'
    }
}

export const SearchPage: Story = {
    args: {
        title: 'Search page',
        sidePanel: false,
        sidePanelSearch: true,
        sidePanelProfile: true,
        showMap: false,
        pageType: 'search'
    }
}

export const SearchPageWithMap: Story = {
    args: {
        title: 'Search page',
        sidePanel: false,
        sidePanelSearch: true,
        sidePanelProfile: true,
        showMap: true,
        pageType: 'search'
    }
}


// ListingPage.decorators = [
//     vueRouter()
// ];
