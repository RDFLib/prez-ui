
export const QUERY_DATASETS = `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX prez: <https://prez.dev/>

CONSTRUCT { ?fc_or_ds a ?class ;
    dcterms:title ?label 
}
WHERE {?fc_or_ds a ?class ;
    dcterms:title ?label .
  VALUES ?class {geo:FeatureCollection dcat:Dataset}
}`

// export const QUERY_DATASETS_FIELDS = {
//     http://purl.org/dc/terms/title
// }

// {
//     title: "Query top level datasets",
//     shortTitle: "",
//     description: "This is a basic example of a select query, which lists the first 10 triples.",
//     query: `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
//     PREFIX dcat: <http://www.w3.org/ns/dcat#>
//     PREFIX dcterms: <http://purl.org/dc/terms/>
//     PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//     PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//     PREFIX prez: <https://prez.dev/>
    
//     CONSTRUCT { ?fc_or_ds a ?class ;
//         dcterms:title ?label 
//     }
//     WHERE {?fc_or_ds a ?class ;
//         dcterms:title ?label .
//       VALUES ?class {geo:FeatureCollection dcat:Dataset}
//     }`
// }
