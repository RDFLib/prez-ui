import { AreaTypes, type Coords } from "@/components/MapClient.d";
import type { MapSearchConfig } from "@/types";

export function spatialSearchQuery(
    featureCollections: string[],
    coords: Coords,
    areaType: AreaTypes,
    radius: number,
    limit: number,
    config: MapSearchConfig
): string {
    let shape: string;
    if (coords.length == 0) {
        shape = '';
    } else if (coords.length == 1) {
        const coord = coords[0];
        shape = `POINT (${coord[0]} ${coord[1]})`;
    } else {
        shape = `POLYGON ((${coords.map(coord => `${coord[0]} ${coord[1]}`).join(', ')}))`;
    }

    return `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
    PREFIX spatialF: <http://jena.apache.org/function/spatial#>
    PREFIX unit: <http://www.opengis.net/def/uom/OGC/1.0/>
    SELECT ?f ?wkt ?fc ?fc_label ?label ?desc ?type ?type_label
    WHERE {
        VALUES ?fc {${featureCollections.map(fc => `<${fc}>`).join(' ')}}
        ?fc rdfs:member ?f .
        ?f a ?type ;
            geo:hasGeometry/geo:asWKT ?wkt .

        OPTIONAL {
            ?f <${config.props.fLabel}> ?label .
        }

        OPTIONAL {
            ?fc <${config.props.fcLabel}> ?fc_label .
        }
    
        OPTIONAL {
            ?f sdo:description ?desc . # config for desc predicate?
        }

        OPTIONAL {
            ?type rdfs:label ?type_label .
        }

        ${() => {switch(areaType) {
            case AreaTypes.Contains: return `FILTER (geof:sfContains("${shape}"^^geo:wktLiteral, ?wkt))`;
            case AreaTypes.Within: return `FILTER (geof:sfWithin("${shape}"^^geo:wktLiteral, ?wkt))`;
            case AreaTypes.Nearby: return `FILTER (spatialF:nearby("${shape}"^^geo:wktLiteral, ?wkt, ${radius}, unit:kilometre))`;
            case AreaTypes.Overlaps: return `FILTER (geof:sfOverlaps("${shape}"^^geo:wktLiteral, ?wkt))`;
            default:
                return '';
        }}}
    }
    LIMIT ${limit}`;
};