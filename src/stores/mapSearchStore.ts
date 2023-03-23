/**
 * This is a pinia store module that provides search functionality for a triple store. It uses the N3.js library for parsing and querying RDF data, and axios for HTTP requests.
 * The searchStore provides a method to get a full tree representation of the datasets and their child feature collections, and a method to get a list of datasets with their titles.
 */
import { defineStore } from 'pinia'
import axios from 'axios'
import { configKey, defaultConfig } from '@/types'
import { inject } from 'vue';
import type { WKTResult } from '@/stores/mapSearchStore.d'

/**
 * Main search store for processing the results of a search SPARQL query
 */
export const mapSearchStore = defineStore({
  id: 'mapSearchStore',

  /**
   * The initial store state
   * @returns {Object}
   */
  state: () => {
    const config = inject(configKey, defaultConfig)
    return {
      data: <WKTResult[]>[],
      success: false,
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
     * Calls the spacePrez search endpoint using a passed in generated query, sets the result WKT in the data object
     */
    async searchMap(query:string) {
        // make the API call to the SPARQL endpoint
        const url = `${this.apiBaseUrl}/s/sparql`
        const response = await axios.get(url,  { headers: {"accept": "application/sparql-results+json"}, params: { query }})


        this.loading = true
        this.success = false

        try {

          this.data = response.data.results.bindings.filter((item:any)=>item.fc_label?.value).map((item:any)=>{
            return {
              uri: item.f_uri.value,
              wkt: item.wkt.value,
              fcLabel: item.fc_label?.value,
              label: item.f_label.value,
              id: item.o.value
            }
          })

        } catch (error:any) {

          // set the error status
          this.error = error.message
          this.success = false

        } finally {
          // always set loading to complete
          this.loading = false
        }

        // successfully processed
        this.success = true
        this.error = null

    }

  }
})
