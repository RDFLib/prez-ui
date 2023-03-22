import { AreaTypes, type Coords } from "@/components/SearchMap.d";
import type { SimpleQueryResult } from "@/stores/search.d";

export type ButtonOption = {
  value: string;
  text: string;
}

export function enumToOptions<T extends Record<string, string>>(myEnum: T): ButtonOption[] {
    return Object.keys(myEnum)
      .map(key => ({
        value: myEnum[key],
        text: key,
      }));
  }

export function simpleQueryResultToOptions(queryResults: SimpleQueryResult[]): ButtonOption[] {
  return queryResults.map(item=>{
    return {value: item.subject, text: item.object}
  })
}

/** Main query function to return a sparql query given a set of feature collections, area type, radius, coordinate data and result limit */
export function mapSearchToSparql(featureCollections:string[], coords:Coords, areaType:AreaTypes, radius: number, limit:number) {

  return mapSearchQuery(
    // create the feature collection query requirements in a SPARQL union format
    queryUnionJoinPart(
      // map a simple list of feature collection URLs into a list of feature collection query parts in SPARQL format
      featureCollections.map(fc=>featureCollectionQueryPart(fc))
    ),
    // turn topo specifications into a SPARQL query
    queryTopoFilterPart(
      shapeQueryPart(coords),
      areaType, 
      radius
    ), 
    limit
  )
  
}


const mapSearchPrefixPart = `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX spatialF: <http://jena.apache.org/function/spatial#>
PREFIX unit: <http://www.opengis.net/def/uom/OGC/1.0/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX sosa: <http://www.w3.org/ns/sosa/>
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX prez: <https://prez.dev/>
`

const featureCollectionQueryPart = (featureCollection:string) => ` <${featureCollection}> rdfs:member ?f_uri . 
<${featureCollection}> dcterms:title ?fc_label
`

/*
{ <http://example.com/datasets/sandgate/catchments> rdfs:member ?f_uri . 
<http://example.com/datasets/sandgate/catchments> dcterms:title ?fc_label
}
*/

/** Constructs a SPARQL query for the SpacePrez map search */
const mapSearchQuery = (featureCollectionsQueryPart:string, topoQueryPart:string, limit:number) => `${mapSearchPrefixPart}
SELECT ?f_uri ?wkt ?fc_label ?f_label ?p ?o
WHERE {
    { ?f_uri geo:hasGeometry/geo:asWKT ?wkt;
  		?p ?o.
    VALUES ?p {dcterms:identifier}
    FILTER(DATATYPE(?o)!=prez:slug)
    }
    ${featureCollectionsQueryPart}
    OPTIONAL {?f_uri rdfs:label ?potential_label }
    BIND(COALESCE(?potential_label, STR(?f_uri)) AS ?f_label)
    ${topoQueryPart}
}
LIMIT ${limit}`

/** Construct SPARQL query union from a set of parts  */
const queryUnionJoinPart = (parts:string[]) => {
  return parts.length > 0 ? `\n    { ${parts.join('}\n    UNION\n    {')} }\n` : ''
}

/** Constructs the filter query part depending on the shape coordinates and area types  */
const queryTopoFilterPart = (shape:string, areaType: AreaTypes, radius:number) => {
  switch(areaType) {
    case AreaTypes.Contains: return `FILTER (geof:sfContains("${shape}"^^geo:wktLiteral, ?wkt))`;
    case AreaTypes.Within: return `FILTER (geof:sfWithin("${shape}"^^geo:wktLiteral, ?wkt))`;
    case AreaTypes.Nearby: return `FILTER (spatialF:nearby("${shape}"^^geo:wktLiteral, ?wkt, ${radius}, unit:kilometre))`;
    case AreaTypes.Overlaps: return `FILTER (geof:sfOverlaps("${shape}"^^geo:wktLiteral, ?wkt))`;
    default: 
      return '';
  }
}

/** Constructs the shape query based on a set of coords */
const shapeQueryPart = (coords: Coords) => {
  if(coords.length == 0) {
    return '';
  } else if(coords.length == 1) {
    const coord = coords[0];
    return `POINT (${coord[0]} ${coord[1]})`;
  } else {
    return `POLYGON ((${coords.map(coord=>`${coord[0]} ${coord[1]}`).join(', ')}))`;
  }
}


