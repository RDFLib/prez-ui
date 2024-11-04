<script setup lang="ts">
import { literal, node } from '@/base/lib';
const baseUrl = 'https://prezv4-with-fuseki.sgraljii8d3km.ap-southeast-2.cs.amazonlightsail.com';
// sample list of items to render in a datatable
const products = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
    { id: 3, name: 'Product 3', price: 300 },
    { id: 4, name: 'Product 4', price: 400 },
];
// sample columns to render in a datatable, id, name, price
const columns = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'price', header: 'Price' },
]

</script>

<template>

    <NuxtLayout contentonly name="utils">

        <h1 class="text-2xl pt-4 font-bold mb-4 mb-1">ui</h1>
        <div class="text-sm mb-10">Check the render of UI components</div>

        <ul>
            <li>
                <fieldset>
                    <legend>Button</legend>
                    <button>Press me</button>
                </fieldset>
            </li>
            <li>
                <fieldset>
                    <legend>DataTable</legend>
                    <table>
                        <thead>
                            <tr v-for="header in columns">
                                <th>{{ header.header }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in products">
                                <td v-for="header in columns">{{ product[header.field] }}</td>
                            </tr>
                        </tbody>
                    </table>             
                </fieldset>
            </li>

            <li>
            <fieldset>
                <legend>Literal</legend>
                <Literal :term="literal({value: 'Literal string value', language: 'en'})"/>
            </fieldset>
            </li>
            <li>
            <fieldset>
                <legend>Node</legend>
                <Node :term="node({value: 'http://www.w3.org/', label: literal('w3 item')})"/>
            </fieldset>
            </li>
            <li>
            <fieldset>
                <legend>ItemBreadcrumb</legend>
                <ItemBreadcrumb
                :custom-items="[{url: '/', label: 'Home'}, {url: '/test/', label: 'Test'}, {url: '/test2/', label: 'Another item'}]"
            />
            </fieldset>
            </li>
            <li>
            <fieldset>
                <legend>Concept</legend>
                <Concept
                :url="baseUrl + '/concept-hierarchy/exm:SchemingConceptScheme/top-concepts'"
                />
            </fieldset>
            </li>
            <li>
            <fieldset>
                <legend>Loading</legend>
                <Loading />
            </fieldset>
            </li>
            <li>
            <fieldset>
                <legend>Item List</legend>
                <ItemList :list="[
                {
                    value: 'http://example.com/item1',
                    label: literal('Item 1'),
                    description: literal('Description of item 1'),
                    properties: {
                    'http://example.com/property1': {
                        predicate: literal('Property 1'),
                        objects: [
                        literal('Object 1'),
                        literal('Object 2')
                        ]
                    },
                    'http://example.com/property2': {
                        predicate: literal('Property 2'),
                        objects: [
                        literal('Object 3'),
                        literal('Object 4')
                        ]
                    }
                    }
                },
                {
                    value: 'http://example.com/item2',
                    label: literal('Item 2'),
                    description: literal('Description of item 2'),
                    properties: {
                    'http://example.com/property1': {
                        predicate: literal('Property 1'),
                        objects: [
                        literal('Object 5'),
                        literal('Object 6')
                        ]
                    },
                    'http://example.com/property2': {
                        predicate: literal('Property 2'),
                        objects: [
                        literal('Object 7'),
                        literal('Object 8')
                        ]
                    }
                    }
                }
                ]"/>
            </fieldset>
            </li>
        </ul>


    </NuxtLayout>

</template>
<style lang="scss" scoped>
fieldset {
    border: 1px solid #ccc;
    padding: 1rem;
    margin-bottom: 1rem;
}
ul {
  list-style-type: none;
}
li {
  padding-bottom: 1rem;
}
</style>