//https://d26ymx92nuuei.cloudfront.net/s/sparql?query=PREFIX%20geo%3A%20%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23%3E%0APREFIX%20dcat%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23%3E%0APREFIX%20dcterms%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0APREFIX%20rdf%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX%20prez%3A%20%3Chttps%3A%2F%2Fprez.dev%2F%3E%0A%0ACONSTRUCT%20{%20%3Ffc_or_ds%20a%20%3Fclass%20%3B%0A%20%20%20%20dcterms%3Atitle%20%3Flabel%20%0A}%0AWHERE%20{%3Ffc_or_ds%20a%20%3Fclass%20%3B%0A%20%20%20%20dcterms%3Atitle%20%3Flabel%20.%0A%20%20VALUES%20%3Fclass%20{geo%3AFeatureCollection%20dcat%3ADataset}%0A}

//const url = 'https://d26ymx92nuuei.cloudfront.net/s/sparql?query=PREFIX%20geo%3A%20%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23%3E%0APREFIX%20dcat%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23%3E%0APREFIX%20dcterms%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0APREFIX%20rdf%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0APREFIX%20prez%3A%20%3Chttps%3A%2F%2Fprez.dev%2F%3E%0A%0ACONSTRUCT%20{%20%3Ffc_or_ds%20a%20%3Fclass%20%3B%0A%20%20%20%20dcterms%3Atitle%20%3Flabel%20%0A}%0AWHERE%20{%3Ffc_or_ds%20a%20%3Fclass%20%3B%0A%20%20%20%20dcterms%3Atitle%20%3Flabel%20.%0A%20%20VALUES%20%3Fclass%20{geo%3AFeatureCollection%20dcat%3ADataset}%0A}'

import { defineStore } from 'pinia'
import axios from 'axios'
import { configKey, defaultConfig } from '@/types'
import { inject } from 'vue';
import { Store, Parser, Quad, NamedNode, DataFactory } from "n3";
const { namedNode, literal } = DataFactory;

export const queryStore = defineStore({
  id: 'queryStore',
  state: () => ({
    apiBaseUrl: inject(configKey, defaultConfig).apiBaseUrl,
    data: [],
    store: new Store(),
    loading: false,
    error: null
  }),
  actions: {

    async fetchData(apiUrl, query:string) {
      try {
        const parser = new Parser();
        this.loading = true
        const response = await axios.get(apiUrl, {
            params: {
                query
            }
        })
        const pdata = parser.parse(response.data)
        this.data = pdata.map(quad=>{
            return {
                subject: quad.subject.value, type: quad.object.value
            }
        })
        this.store = new Store(pdata)
        
        for (const quad of this.store.match(namedNode('http://purl.org/dc/terms/title'), null, null))
        console.log(quad);
        
        
        console.log("QUAD", this.data)
        //this.store.match()
        console.log("STORE", this.store)
        //this.store.getSubjects(NamedNode(qname("a")), namedNode(qname("rdf:bag")), null)[0];
        this.error = null
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})
