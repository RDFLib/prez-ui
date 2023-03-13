import { defineStore } from 'pinia'
import axios from 'axios'
import { configKey, defaultConfig } from '@/types'
import { inject } from 'vue';
import { Util, Literal, Store, Parser, DataFactory, type Term } from "n3";
const { namedNode, literal } = DataFactory;



export type MatchFilter = {
    subject?: Term | null,
    object?: Term | null,
    predicate?: Term | null
}

export const matchDatasets:MatchFilter = {object: namedNode('http://www.w3.org/ns/dcat#Dataset')}
export const matchFeatureCollections:MatchFilter = {predicate: namedNode('http://purl.org/dc/terms/title')}

export const queryStore = defineStore({
  id: 'queryStore',
  state: () => ({
    apiBaseUrl: inject(configKey, defaultConfig).apiBaseUrl,
    data: {},
    store: new Store(),
    loading: false,
    error: null
  }),
  actions: {

    // filter out only the triples we need, and simplify the result data array
    matchData(filter:MatchFilter) {
        const data = []

        const { subject=null, predicate=null, object=null } = filter
        for (const triple of this.store.match(subject, predicate, object)) {
            data.push({subject: triple.subject.id, predicate: triple.predicate.id, object: Util.isLiteral(triple.object) ? triple.object.value : triple.object.id})
        }
        return data
    },

    async fetchData(apiUrl, query:string) {
      try {
        const parser = new Parser();
        this.loading = true
        const response = await axios.get(apiUrl, { params: { query }})
        // const response = await axios.get('http://localhost:8010/proxy/s/sparql?query=PREFIX+geo:+%3Chttp:%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23%3E%0APREFIX+dcat:+%3Chttp:%2F%2Fwww.w3.org%2Fns%2Fdcat%23%3E%0APREFIX+dcterms:+%3Chttp:%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0APREFIX+rdf:+%3Chttp:%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0APREFIX+rdfs:+%3Chttp:%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX+prez:+%3Chttps:%2F%2Fprez.dev%2F%3E%0A%0ACONSTRUCT+%7B%3Fds+a+dcat:Dataset+%3B%0A%09%09%09%09dcterms:title+%3Fds_title+%3B%0A%09%09%09%09rdfs:member+%3Ffc+.%0A%09%09%09%3Ffc+a+geo:FeatureCollection+%3B%0A%09%09%09%09dcterms:title+%3Ffc_title%7D%0AWHERE+%7BGRAPH+prez:spaceprez-system-graph+%7B%3Chttps:%2F%2Fprez.dev%2FDatasetList%3E+rdfs:member+%3Fds+%7D%0A%09%09%3Fds+rdfs:member+%3Ffc+%3B')
        //const response = await axios.post(`${apiUrl}?query=${query}`, {})

        this.data = parser.parse(response.data)
        this.store = new Store(this.data)
        this.error = null
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})
