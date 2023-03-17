
export const QUERY_DATASETS_FC = `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX prez: <https://prez.dev/>

CONSTRUCT {?ds a dcat:Dataset ;
    dcterms:title ?ds_title ;
    rdfs:member ?fc .
  ?fc a geo:FeatureCollection ;
    dcterms:title ?fc_title}
WHERE {<https://prez.dev/DatasetList> rdfs:member ?ds.
  ?ds rdfs:member ?fc ;
      dcterms:title ?ds_title .
  ?fc dcterms:title ?fc_title
      }`

type RestrictionFilters = {
	[field: string]: string;
}

// function make_query_topo_filter() {
//     let geosparql;
//     if (document.getElementById('spatial-contains').checked) {
//         geosparql = `    FILTER (geof:sfContains("${shape}"^^geo:wktLiteral, ?wkt))`
//     } else if (document.getElementById('spatial-within').checked) {
//         geosparql = `    FILTER (geof:sfWithin("${shape}"^^geo:wktLiteral, ?wkt))`
//     } else if (document.getElementById('spatial-nearby').checked) {
//         let radius = document.getElementById('nearby-radius').value
//         geosparql = `    FILTER (spatialF:nearby("${shape}"^^geo:wktLiteral, ?wkt, ${radius}, unit:kilometre))`
//     } else {
//         geosparql = `    FILTER (geof:sfOverlaps("${shape}"^^geo:wktLiteral, ?wkt))`
//     }
//     return geosparql
// }

// export const QUERY_MAP_SEARCH = (restrictionFilter:RestrictionFilters)
//             `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
// PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
// PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
// PREFIX spatialF: <http://jena.apache.org/function/spatial#>
// PREFIX unit: <http://www.opengis.net/def/uom/OGC/1.0/>
// PREFIX dcterms: <http://purl.org/dc/terms/>
// PREFIX sosa: <http://www.w3.org/ns/sosa/>
// PREFIX void: <http://rdfs.org/ns/void#>
// SELECT ?f_uri ?wkt ?label ?fc_label
// WHERE {
//     { ?f_uri geo:hasGeometry/geo:asWKT ?wkt }
//     ${restrictionFilter}
//     OPTIONAL {?f_uri sosa:hasSimpleResult ?potential_label }
//     BIND(COALESCE(?potential_label, "") AS ?label)
//     ${geoFilter}
// }
// LIMIT ${limit}
// `

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
