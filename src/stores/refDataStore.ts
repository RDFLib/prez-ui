/**
 * This is a pinia store module that provides search functionality for a triple store. It uses the N3.js library for parsing and querying RDF data, and axios for HTTP requests.
 * The searchStore provides a method to get a full tree representation of the datasets and their child feature collections, and a method to get a list of datasets with their titles.
 */
import { defineStore } from 'pinia'
import axios from 'axios'
import { inject } from 'vue';
import { apiBaseUrlConfigKey } from "@/types";


/**
 * Factory store function
 */
export function refDataStore(id:string) {
  
  return defineStore(
  {
    id,

    /**
     * The initial store state
     * @returns {Object}
     */
    state: () => {
      const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;

      //    const config = inject(configKey, defaultConfig)
      return {
        data: [] as Array<object>,
        success: false,
        loading: false,
        error: null,
        apiBaseUrl: apiBaseUrl
      }
    },

    /**
     * Callable actions
     */
    actions: {

      /**
       * Calls the SPARQL endpoint with the predefined query, returns a generalised object array from the json response
       */
      async fetch<T>(subsystem:"s"|"c"|"v", query:string):Promise<void> {
          // make the API call to the SPARQL endpoint
          const url = `${this.apiBaseUrl}/${subsystem}/sparql`
          this.loading = true
          this.success = false

          try {
            const response = await axios.get(url,  { headers: {"accept": "application/sparql-results+json"}, params: { query }})
            this.data = response.data.results.bindings.map((item:any)=>{
              let result:any = {}
              Object.keys(item).forEach(key=>{
                result[key] = item[key].value
              })
              return result
            })
            // successfully processed
            this.success = true
            this.error = null

          } catch (error:any) {
            // set the error status
            this.error = error.message
            this.data = []
            this.success = false

          } finally {
            // always set loading to complete
            this.loading = false
          }

      }

    }
  })
}

