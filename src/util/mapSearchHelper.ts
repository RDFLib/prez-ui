import { AreaTypes, type Coords } from "@/components/MapClient.d";
import type { MapSearchConfig } from "@/types";

/** button option attributes */
export type ButtonOption = {
  value: string;
  text: string;
}

/** turn an enum into button options */
export function enumToOptions<T extends Record<string, string>>(myEnum: T): ButtonOption[] {
    return Object.keys(myEnum)
      .map(key => ({
        value: myEnum[key],
        text: key,
      }));
}

/** Main query function to return a sparql query given a set of feature collections, area type, radius, coordinate data and result limit */
export function mapSearchToSparql(
  featureCollections:string[], 
  coords:Coords,
  areaType:AreaTypes, 
  radius: number, 
  limit:number, 
  config: MapSearchConfig) {

  return mapSearchQuery(
    // create the feature collection query requirements in a SPARQL union format
    queryUnionJoinPart(
      // map a simple list of feature collection URLs into a list of feature collection query parts in SPARQL format
      featureCollections.map(fc=>featureCollectionQueryPart(fc, config))
    ),
    // turn topo specifications into a SPARQL query
    queryTopoFilterPart(
      shapeQueryPart(coords),
      areaType, 
      radius
    ), 
    limit,
    config
  )
  
}

//PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
//PREFIX dcterms: <http://purl.org/dc/terms/>

const mapSearchPrefixPart = `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX spatialF: <http://jena.apache.org/function/spatial#>
PREFIX unit: <http://www.opengis.net/def/uom/OGC/1.0/>
PREFIX sosa: <http://www.w3.org/ns/sosa/>
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX prez: <https://prez.dev/>
`

const featureCollectionQueryPart = (featureCollection:string, config: MapSearchConfig) => ` <${featureCollection}> <${config.spatial.membershipRelationship}> ?f_uri . 
<${featureCollection}> <${config.props.fcLabel}> ?fc_label
`

/** Constructs a SPARQL query for the SpacePrez map search */
const mapSearchQuery = (featureCollectionsQueryPart:string, topoQueryPart:string, limit:number, config: MapSearchConfig) => `${mapSearchPrefixPart}
SELECT ?f_uri ?wkt ?fc_label ?f_label
WHERE {
    { ?f_uri geo:hasGeometry/geo:asWKT ?wkt;
    }
    ${featureCollectionsQueryPart}
    OPTIONAL {?f_uri <${config.props.fcLabel}> ?potential_label }
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
export const shapeQueryPart = (coords: Coords) => {
  if(coords.length == 0) {
    return '';
  } else if(coords.length == 1) {
    const coord = coords[0];
    return `POINT (${coord[0]} ${coord[1]})`;
  } else {
    return `POLYGON ((${coords.map(coord=>`${coord[0]} ${coord[1]}`).join(', ')}))`;
  }
}

/** required to honour the object typing in the map config object, this is required when injecting config */
export function convertConfigTypes(config: any): any {
  // If config is a string, try to parse it as a number
  if (typeof config === 'string') {
    const num = Number(config);
    if (!isNaN(num)) {
      return num;
    }
  }
  // If config is an object, recursively traverse its properties
  else if (typeof config === 'object' && config !== null) {
    const newObj: any = {};
    for (const prop in config) {
      newObj[prop] = convertConfigTypes(config[prop]);
    }
    return newObj;
  }
  // Otherwise, return the config as-is
  return config;
}