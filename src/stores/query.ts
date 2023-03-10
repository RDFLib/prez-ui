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
