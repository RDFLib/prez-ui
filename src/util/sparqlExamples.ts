export default {
    "Basic Select": `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT *
WHERE {
    ?s ?p ?o .
} LIMIT 10`,
    "Basic Construct": `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
CONSTRUCT {
    ?s ?p ?o .
}
WHERE {
    ?s ?p ?o .
} LIMIT 10`,
};