import axios from "axios";
const runtimeConfig = useRuntimeConfig();
const maxLength = runtimeConfig.public.prezProvenancePathMaxLength;

const queryProvenance: any = async (resourceUri: String | undefined, label: String | undefined, apiEndpoint: String | undefined, remainingSteps: number) => {
  if (resourceUri && remainingSteps > 0) {
    const queryResults = await axios.get(
      apiEndpoint +
        "/sparql?query=" +
        encodeURIComponent(`PREFIX prov: <http://www.w3.org/ns/prov#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
          PREFIX schema: <https://schema.org/>
          PREFIX foaf: <http://xmlns.com/foaf/0.1/>

          SELECT
            ?wasDerivedFrom
            (COALESCE(?rdfsLabel, ?prefLabel, ?name, ?wasDerivedFrom) AS ?label)
            ?attributedTo
            (COALESCE(?attributedToRdfsLabel, ?attributedToPrefLabel, ?attributedToName) AS ?attributedToLabel)
          WHERE {
            <${resourceUri}> prov:wasDerivedFrom ?wasDerivedFrom .
            OPTIONAL { ?wasDerivedFrom rdfs:label ?rdfsLabel . }
            OPTIONAL { ?wasDerivedFrom skos:prefLabel ?prefLabel . }
            OPTIONAL { ?wasDerivedFrom schema:name ?name . }
            OPTIONAL {
              <${resourceUri}> prov:wasAttributedTo ?attributedTo .
              OPTIONAL { ?attributedTo rdfs:label ?attributedToRdfsLabel . }
              OPTIONAL { ?attributedTo skos:prefLabel ?attributedToPrefLabel . }
              OPTIONAL { ?attributedTo foaf:firstName ?attributedToFirstName . }
              OPTIONAL { ?attributedTo foaf:family_name ?attributedToFamilyName . }
              BIND(IF(BOUND(?attributedToFamilyName),
                      CONCAT(IF(BOUND(?attributedToFirstName), CONCAT(?attributedToFirstName, " "), ""), ?attributedToFamilyName),
                      STR(?attributedTo))
              AS ?attributedToName)
            }
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

export async function getProvenance(resourceUri: String | undefined, label: String | undefined, apiEndpoint: String | undefined) {
  // get derivation chain
  let provenance: any = await queryProvenance(resourceUri, label, apiEndpoint, maxLength);
  return provenance;
}
