/**
 * This is a pinia store module that provides search functionality for a triple store. It uses the N3.js library for parsing and querying RDF data, and axios for HTTP requests.
 * The searchStore provides a method to get a full tree representation of the datasets and their child feature collections, and a method to get a list of datasets with their titles.
 */
import { Buffer } from 'buffer'
import { defineStore } from 'pinia'
import axios from 'axios'
import { Util, Store, Parser, DataFactory, type Term, Quad } from "n3";
const { namedNode } = DataFactory;

import { configKey, defaultConfig } from '@/types'
import { inject } from 'vue';

export type WKTResult = {
  uri: string
  wkt: string
  fcLabel: string
  label: string
  id: string
}

// ************************************** TEMP DEV STUFF - REMOVE!
//const username = 'admin';
//const password = 'improvementneeded';

/**
 * Main search store for processing the results of a search SPARQL query
 */
export const mapsearchStore = defineStore({
  id: 'mapsearchStore',

  /**
   * The initial store state
   * @returns {Object}
   */
  state: () => {
    const config = inject(configKey, defaultConfig)
    return {
      data: <Quad[]>[],
      success: false,
      store: new Store(),
      loading: false,
      error: null,
      apiBaseUrl: config.apiBaseUrl
    }
  },

  /**
   * Callable actions
   */
  actions: {

    /**
     * Calls the spacePrez search endpoint using the query for spacePrez
     */
    async fetchMapData(query:string) {
        // make the API call to the SPARQL endpoint
        //const url = 'http://prez-demo-fuseki-lb-597318139.ap-southeast-2.elb.amazonaws.com:3030/sp'
        //"Authorization": `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
        const url = `${this.apiBaseUrl}/s/sparql`
        const response = await axios.get(url,  { headers: {"accept": "application/sparql-results+json"}, params: { query }})

        const results:WKTResult[] = response.data.results.bindings.filter((item:any)=>item.fc_label?.value).map((item:any)=>{
          return {
            uri: item.f_uri.value,
            wkt: item.wkt.value,
            fcLabel: item.fc_label?.value,
            label: item.f_label.value,
            id: item.o.value
          }

        })
        return results
    },

    /**
     * Makes a GET request to the specified API endpoint with the provided SPARQL query.
     * Parses the response with the N3 parser and creates a new N3 store from the parsed data.
     * @param apiUrl - The URL of the SPARQL endpoint.
     * @param query - The SPARQL query to execute.
     */
    async fetchData(apiUrl:string, query:string) {
      try {
        // initialise the state
        const parser = new Parser();
        this.loading = true
        this.success = false

        // make the API call to the SPARQL endpoint
        const response = await axios.get(apiUrl, { params: { query }})

        // process the response through the N3 parser
        this.data = parser.parse(response.data)

        // create a new N3 store from the parsed data
        this.store = new Store(this.data)

        // successfully processed
        this.success = true
        this.error = null

      } catch (error:any) {

        // set the error status
        this.error = error.message
        this.success = false

      } finally {
        // always set loading to complete
        this.loading = false
      }
    }
  }
})
