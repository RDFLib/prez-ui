/**
 * This is a pinia store module that makes a sparql API query to get datasets and feature collection information. 
 * It uses the N3.js library for parsing and querying RDF data, and axios for HTTP requests.
 * This store provides a method to get a full tree representation of the datasets and their child feature collections, 
 * and a method to get a list of datasets with their titles.
 */
import { defineStore } from 'pinia'
import axios from 'axios'
import { Util, Store, Parser, DataFactory, Quad } from "n3";
const { namedNode } = DataFactory;
import type { DatasetTree, MatchFilter, SimpleQueryResult } from '@/stores/datasetsStore.d'
import { mapConfigKey, type MapConfig, type MapSearchConfig } from "@/types";
import { apiBaseUrlConfigKey } from "@/types";
import { inject } from 'vue';
import { convertConfigTypes } from '@/util/mapSearchHelper';

/**
 * SPARQL query to return all datasets and feature collections required
 */
const getDatasetFeatureQuery = (config: MapSearchConfig) => {
  return `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX prez: <https://prez.dev/>

CONSTRUCT {?ds a <${config.spatial.datasetClass}> ;
    <${config.props.dsLabel}> ?ds_title ;
    <${config.spatial.membershipRelationship}> ?fc .
  ?fc a geo:FeatureCollection ;
  <${config.props.fcLabel}> ?fc_title}
WHERE { ?ds a <${config.spatial.datasetClass}> ;
      <${config.spatial.membershipRelationship}> ?fc ;
      <${config.props.dsLabel}> ?ds_title .
  ?fc <${config.props.fcLabel}> ?fc_title
      }`
}

/**
 * Converts a quad/triple object from N3 into a simple result type for easier template processing
 * @param {Object} quad - The quad/triple object from N3 to convert
 * @returns {SimpleQueryResult} - The simple query result object
 */
export const quadToSimpleQueryResult = (quad:any):SimpleQueryResult => {
  // Note: Quad type import issues, conflict with RDF library, so has an any type for now...
  return {
    subject: quad.subject.id,
    predicate: quad.predicate.id,
    object: Util.isLiteral(quad.object) ? quad.object.value : quad.object.id
  }
}

/**
 * Main search store for processing the results of a search SPARQL query
 */
export const datasetsStore = defineStore({
  id: 'datasetsStore',

  /**
   * The initial store state
   * @returns {Object}
   */
  state: () => {
    // get the default map settings
    const mapConfig = convertConfigTypes(inject(mapConfigKey)) as MapConfig;
    const apiBaseUrl = inject(apiBaseUrlConfigKey) as string;
    //const config = inject(configKey, defaultConfig)
    return {
      data: <Quad[]>[],
      success: false,
      store: new Store(),
      loading: false,
      error: null,
      apiBaseUrl,
      mapConfig
    }
  },

  /**
   * Callable actions
   */
  actions: {

    /**
     * Get a list of triple/quads matching the provided filter, simplified for easier template processing
     * @param {MatchFilter} filter - The filter to match the triples/quads
     * @returns {SimpleQueryResult[]} - The list of matching triples/quads
     */
    getMatchedData(filter:MatchFilter) {
      const data:SimpleQueryResult[] = []

      const { subject=null, predicate=null, object=null } = filter
      for (const item of this.store.match(subject, predicate, object)) {
          data.push(quadToSimpleQueryResult(item))//  {subject: item.subject.id, predicate: item.predicate.id, object: Util.isLiteral(item.object) ? item.object.value : item.object.id})
      }
      return data
    },

    /**
     * Get a full tree representation of the datasets and child feature collections
     * @returns {DatasetTree} - The tree representation of the datasets and child feature collections
     */
    getDatasetTree() {
      const datasetTree:DatasetTree = [
      ]
      this.getDatasets().forEach(dataset=>{
        datasetTree.push({
          item: dataset,
          featureCollections: this.getFeatureCollections([dataset.subject])
        })
      })
      return datasetTree;

    },


    /**
     * Get a list of dataset, performs a second match on the dataset subject to get the title
     * @returns SimpleQueryResult array
     */
    getDatasets() {
      let results: SimpleQueryResult[] = []
      const matched = this.getMatchedData({object: namedNode(this.mapConfig.search.spatial.datasetClass)})
      matched.forEach(itemLink=>{
        for(const item of this.store.match(namedNode(itemLink.subject), namedNode(this.mapConfig.search.props.dsLabel))) {
          results.push(quadToSimpleQueryResult(item))
        }
      })
      return results
    },

    
    /**
     * Returns a list of SimpleQueryResult objects representing all feature collections for a given list of dataset subjects.
     * If no datasetSubjects are provided, all matching feature collections will be returned.
     * @param datasetSubjects - List of dataset subjects to filter feature collections by.
     * @returns List of SimpleQueryResult objects representing the feature collections.
     */
    getFeatureCollections(datasetSubjects:string[]):SimpleQueryResult[] {
      if(datasetSubjects.length == 0) {
        return [] // changed to return empty
        // simply returns all matching feature collections
        //        return this.getMatchedData({predicate: namedNode('http://purl.org/dc/terms/title')})
      } else {
        // narrow down to a specific dataset
        let results:SimpleQueryResult[] = []
        datasetSubjects.forEach(subject=>{
          const matchedFCs = this.getMatchedData({predicate: namedNode(this.mapConfig.search.spatial.membershipRelationship), subject: namedNode(subject)})
          matchedFCs.forEach(itemLink=>{
            for(const item of this.store.match(namedNode(itemLink.object), namedNode(this.mapConfig.search.props.fcLabel))) {
              results.push(quadToSimpleQueryResult(item))
            }
          })
        })
        return results
      }
    },

    /**
     * Calls the spacePrez search endpoint using the query for spacePrez
     */
    async fetchSpacePrezData() {
        return await this.fetchData(`${this.apiBaseUrl}/s/sparql`, getDatasetFeatureQuery(this.mapConfig.search));
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
