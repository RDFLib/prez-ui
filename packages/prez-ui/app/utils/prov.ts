import axios from "axios";
const runtimeConfig = useRuntimeConfig();
const maxLength = runtimeConfig.public.prezProvenancePathMaxLength;

const queryProvenance: any = async (resourceUri: String | undefined, label: String | undefined, apiEndpoint: String | undefined, remainingSteps: number, additionalData: object) => {
  if (resourceUri && remainingSteps > 0) {
    // query for derivations
    const derivationQueryResults = await axios.get(
      apiEndpoint +
        "/sparql?query=" +
        encodeURIComponent(`PREFIX prov: <http://www.w3.org/ns/prov#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
          PREFIX schema: <https://schema.org/>
          PREFIX foaf: <http://xmlns.com/foaf/0.1/>

          SELECT
            ?wasDerivedFrom
            (COALESCE(?rdfsLabel, ?prefLabel, ?name, ?wasDerivedFrom) AS ?wasDerivedFromLabel)
          WHERE {
            <${resourceUri}> prov:wasDerivedFrom ?wasDerivedFrom .
            OPTIONAL { ?wasDerivedFrom rdfs:label ?rdfsLabel . }
            OPTIONAL { ?wasDerivedFrom skos:prefLabel ?prefLabel . }
            OPTIONAL { ?wasDerivedFrom schema:name ?name . }
          }
        `),
    );
    // query for attributions
    const attributionQueryResults = await axios.get(
      apiEndpoint +
        "/sparql?query=" +
        encodeURIComponent(`PREFIX prov: <http://www.w3.org/ns/prov#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
          PREFIX schema: <https://schema.org/>
          PREFIX foaf: <http://xmlns.com/foaf/0.1/>

          SELECT
            ?attributedTo
            (COALESCE(?attributedToRdfsLabel, ?attributedToPrefLabel, ?attributedToName) AS ?attributedToLabel)
          WHERE {
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
        `),
    );
    let wasDerivedFrom = [];
    if (derivationQueryResults?.data?.results?.bindings?.length) {
      for (const result of derivationQueryResults.data.results.bindings) {
        wasDerivedFrom.push(await queryProvenance(result.wasDerivedFrom.value, result.wasDerivedFromLabel.value, apiEndpoint, (remainingSteps - 1)));
      }
    }
    let additionalData: object = {};
    if (attributionQueryResults?.data?.results?.bindings?.length) {
      for (const result of attributionQueryResults.data.results.bindings) {
        if (result.attributedTo?.value) {
          additionalData = {
            attributedTo: {
              uri: result.attributedTo?.value,
              label: result.attributedToLabel?.value
            }
          };
        }
      }
    }
    return {
      uri: resourceUri,
      label: label,
      wasDerivedFrom: wasDerivedFrom,
      ...additionalData
    };
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
