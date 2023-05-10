export default [
    {
        title: "Example Select Query",
        shortTitle: "Basic Select",
        description: "This is a basic example of a select query, which lists the first 10 triples.",
        query: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT *
WHERE {
    ?s ?p ?o .
} LIMIT 10`
    },
    {
        title: "Example Construct Query",
        shortTitle: "Basic Construct",
        description: "This is a basic example of a construct query, which constructs a graph of the first 10 triples.",
        query: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
CONSTRUCT {
    ?s ?p ?o .
}
WHERE {
    ?s ?p ?o .
} LIMIT 10`
    },
    {
        title: "Vocabularies - Counting Concepts",
        shortTitle: "Concept Count",
        description: "Here is an example query for VocPrez you can copy 'n paste into the Query UI text area above to test with. It counts the number of vocabulary Concepts in the all vocabularies in this system and will return an integer: ",
        query: `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT (COUNT(?c) AS ?count)
WHERE {
    ?c a skos:Concept .
}`
    },
    {
        title: "Spatial Data Catalog - Basic Feature Information",
        shortTitle: "Feature Info",
        description: "Here is an example query for SpacePrez for use in the Query UI above. It returns most two Features' URIs and their titles.",
        query: `PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?uri ?title
WHERE {
    ?uri a geo:Feature ;
        dcterms:title|rdfs:label ?title .
}
LIMIT 2`
    },
];