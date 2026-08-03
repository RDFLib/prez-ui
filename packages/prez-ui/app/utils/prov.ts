import type {SPARQLResultsJSON} from "~/utils/types.ts";

const runtimeConfig = useRuntimeConfig();
const maxLength = runtimeConfig.public.prezProvenancePathMaxLength;

type AdditionalData = {
    attributedTo: {
        uri?: string;
        label?: string;
    };
};

type ProvReturnType = {
    uri?: string;
    label?: string;
    wasDerivedFrom?: ProvReturnType[];
    additionalData?: AdditionalData;
};

const queryProvenance = async (resourceUri?: string, label?: string, apiEndpoint?: string, remainingSteps?: number, additionalData?: AdditionalData): Promise<ProvReturnType> => {
    if (resourceUri && remainingSteps && remainingSteps > 0) {
        const derivationQuery = `PREFIX prov: <http://www.w3.org/ns/prov#>
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
        `;
        const attributionQuery = `PREFIX prov: <http://www.w3.org/ns/prov#>
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
        `;

        const [derivationQueryResults, attributionQueryResults] = await Promise.all([
            $fetch<SPARQLResultsJSON>(apiEndpoint + "/sparql", {
                query: {
                    query: derivationQuery,
                },
            }),
            $fetch<SPARQLResultsJSON>(apiEndpoint + "/sparql", {
                query: {
                    query: attributionQuery,
                },
            })
        ]);
        let wasDerivedFrom = [];
        if (derivationQueryResults?.results?.bindings?.length) {
            for (const result of derivationQueryResults.results.bindings) {
                wasDerivedFrom.push(await queryProvenance(result.wasDerivedFrom?.value, result.wasDerivedFromLabel?.value, apiEndpoint, (remainingSteps - 1)));
            }
        }
        let additionalData: object = {};
        if (attributionQueryResults?.results?.bindings?.length) {
            for (const result of attributionQueryResults.results.bindings) {
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

export async function getProvenance(resourceUri?: string, label?: string, apiEndpoint?: string) {
    // get derivation chain
    return await queryProvenance(resourceUri, label, apiEndpoint, maxLength);
}
