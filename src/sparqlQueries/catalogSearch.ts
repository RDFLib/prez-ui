/**
 * Creates a SPARQL query that selects the top 10 most common themes
 * 
 * @param catalogs 
 * @returns 
 */
export function getThemesQuery(catalogs: string[] = []): string {
    return `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX dcat: <http://www.w3.org/ns/dcat#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    
    SELECT ?theme ?title (COUNT(?theme) AS ?count)
    WHERE {
        ?resource a dcat:Resource ;
            ^dcterms:hasPart ?hasPart .
        ${catalogs.length > 0 ? `FILTER (?hasPart IN (${catalogs.map(cat=>`<${cat}>`).join(', ')}))` : ``}  
        ?resource dcat:theme ?theme .
        ?theme skos:prefLabel ?title .
    }
    GROUP BY ?theme ?title
    ORDER BY DESC(?count) ?title
    LIMIT 10`;
}

/**
 * Creates a SPARQL query that searches dcat:Resoures filtered by catalog, themes, geometry and weighted text search
 * 
 * @param catalogs 
 * @param searchTerm 
 * @param themes 
 * @param shape 
 * @param limit 
 * @returns 
 */
export function catalogSpatialSearch(catalogs: string[] = [], searchTerm: string = "", themes: string[] = [], shape: string = "", limit: number = 0): string {
    return `
    PREFIX dcat: <http://www.w3.org/ns/dcat#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

    SELECT ?resource ?title ?desc (GROUP_CONCAT(?theme;separator="\t") AS ?themeList) (GROUP_CONCAT(?themeLabel;separator="\t") AS ?themeListLabels) ?weight
    WHERE {
        # Only look for Resources (not spatial Datasets)
        ?resource a dcat:Resource .

        # Only look in selected cats
        ?resource ^dcterms:hasPart ?hasPart .
        ${catalogs.length > 0 ? `FILTER (?hasPart IN (${catalogs.map(cat=>`<${cat}>`).join(', ')}))` : ``}

        # Weighted text search
        {
            SELECT DISTINCT ?resource ?title ?desc (SUM(?w) AS ?weight)
            WHERE {
                ?resource a dcat:Resource .
                {
                    ?resource
                        dcterms:title ?title ;
                        dcterms:description ?desc ;
                        .
                    BIND (50 AS ?w)
                    FILTER REGEX(?title, "^${searchTerm}$", "i")
                } UNION {
                    ?resource 
                        dcterms:title ?title ;
                        dcterms:description ?desc ;
                        .
                    BIND (10 AS ?w)
                    FILTER REGEX(?title, "${searchTerm}", "i")
                    FILTER(?desc!="")
                } UNION {
                    ?resource 
                        dcterms:title ?title ;
                        dcterms:description ?desc ;
                        .
                    BIND (5 AS ?w)
                    FILTER REGEX(?desc, "${searchTerm}", "i")
                }  
            }
            GROUP BY ?resource ?title ?desc ?match
            ORDER BY DESC(?weight) ?title
        }

        # Theme filter. each theme's IRI is a new line in the VALUES {}
        ${themes.length > 0 ? `VALUES ?theme { ${themes.map(theme=>`<${theme}>`).join(' ')} }` : ``}
        ?resource dcat:theme ?theme .
        ?theme skos:prefLabel ?themeLabel .

        # Spatial Filter
        ${shape != '' ? `
        ?resource geo:hasBoundingBox/geo:asWKT ?wkt ;
        FILTER (geof:sfOverlaps("${shape})"^^geo:wktLiteral, ?wkt))` : ``}

    } GROUP BY ?resource ?title ?desc ?weight
    ${limit > 0 ? `LIMIT ${limit}` : ``}`;
}