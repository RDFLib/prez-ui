export const QUERY_GET_CATALOGS = `
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>

SELECT ?c ?t
WHERE {
  GRAPH ?g {
  ?c a dcat:Catalog ;
  	dcterms:title ?t .
  }
}
ORDER BY ?t`

export function QUERY_GET_THEMES(catalogs:string[]=[]) {
  return `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
SELECT ?th ?pl (COUNT(?th) AS ?count)
WHERE {
  ?r a dcat:Resource ;
    ^dcterms:hasPart ?hasPart .
  ${catalogs.length > 0 ? `FILTER (?hasPart IN (${catalogs.map(cat=>`<${cat}>`).join(', ')}))` : ``}  
  ?r dcat:theme ?th .
  ?th skos:prefLabel ?pl .
}
GROUP BY ?th ?pl
ORDER BY DESC(?count) ?pl
LIMIT 10`
}

export function QUERY_SEARCH(catalogs:string[]=[], searchTerms:string='', themes:string[]=[], shape:string='', limit:number=0) {
  return `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX dcat: <http://www.w3.org/ns/dcat#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX geof: <http://www.opengis.net/def/function/geosparql/>

    SELECT ?r ?t ?d (GROUP_CONCAT(?th;separator="\t") AS ?thlist) (GROUP_CONCAT(?thpl;separator="\t") AS ?thpllist) ?weight
    WHERE {
        # Only look for Resources (not spatial Datasets)
        ?r a dcat:Resource .

        # Only look in selected cats
        ?r  ^dcterms:hasPart ?hasPart  .
        ${catalogs.length > 0 ? `FILTER (?hasPart IN (${catalogs.map(cat=>`<${cat}>`).join(', ')}))` : ``}  

        # Weighted text search
        {
          SELECT DISTINCT ?r ?t ?d (SUM(?w) AS ?weight)
          WHERE {
            ?r a dcat:Resource .
            {
              ?r
                dcterms:title ?t ;
                dcterms:description ?d ;
                .
              BIND (50 AS ?w)
              FILTER REGEX(?t, "^${searchTerms}$", "i")
            }
            UNION
            {
              ?r 
                dcterms:title ?t ;
                dcterms:description ?d ;
                .
              BIND (10 AS ?w)
              FILTER REGEX(?t, "${searchTerms}", "i")
              FILTER(?d!="")
            }
            UNION
            {
              ?r 
                dcterms:title ?t ;
                dcterms:description ?d ;
                .
              BIND (5 AS ?w)
              FILTER REGEX(?d, "${searchTerms}", "i")
            }  
          }
          GROUP BY ?r ?t ?d ?match
          ORDER BY DESC(?weight) ?t
        }

        # Theme filter. each theme's IRI is a new line in the VALUES {}
        ${themes.length > 0 ? `VALUES ?th { ${themes.map(theme=>`<${theme}>`).join(' ')} }` : ``}
        ?r dcat:theme ?th .
        ?th skos:prefLabel ?thpl .

        # Spatial Filter
        ${shape != '' ? `
        ?r geo:hasBoundingBox/geo:asWKT ?wkt ;
        FILTER (geof:sfOverlaps("${shape})"^^geo:wktLiteral, ?wkt))` : ``}

    } GROUP BY ?r ?t ?d ?weight
    ${limit > 0 ? `LIMIT ${limit}` : ``}`

}
