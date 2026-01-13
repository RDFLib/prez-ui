import axios from "axios";
const PROVENENCE_CHAIN_MAX_LENGTH = 5;

const queryProvenance = async (resourceUri: String, label: String, apiEndpoint: String, remainingSteps: Number) => {
  if (resourceUri && remainingSteps > 0) {
    const queryResults = await axios.get(
      apiEndpoint +
        "/sparql?query=" +
        encodeURIComponent(`PREFIX prov: <http://www.w3.org/ns/prov#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
          PREFIX schema: <https://schema.org/>

          SELECT ?wasDerivedFrom (COALESCE(?rdfsLabel, ?prefLabel, ?name, ?wasDerivedFrom) AS ?label) WHERE {
            <${resourceUri}> prov:wasDerivedFrom ?wasDerivedFrom .
            OPTIONAL { ?wasDerivedFrom rdfs:label ?rdfsLabel . }
            OPTIONAL { ?wasDerivedFrom skos:prefLabel ?prefLabel . }
            OPTIONAL { ?wasDerivedFrom schema:name ?name . }
          }
        `),
    );
    if (queryResults?.data?.results?.bindings?.length) {
      let results = [];
      for (const result of queryResults.data.results.bindings) {
        results.push(await queryProvenance(result.wasDerivedFrom.value, result.label.value, apiEndpoint, (remainingSteps - 1)));
      }
      return {
        uri: resourceUri,
        label: label,
        wasDerivedFrom: results
      };
    }
  }
  return {
    uri: resourceUri,
    label: label
  };
}

export async function getProvenance(resourceUri: String, label: String, apiEndpoint: String) {
  // get derivation chain
  let provenance = await queryProvenance(resourceUri, label, apiEndpoint, PROVENENCE_CHAIN_MAX_LENGTH);
  return provenance;
}
