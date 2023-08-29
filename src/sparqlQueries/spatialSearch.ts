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

    let spatialFilter = "";
    
    switch(areaType) {
        case AreaTypes.Contains:
            spatialFilter = `FILTER (geof:sfContains("${shape}"^^geo:wktLiteral, ?wkt))`;
            break;
        case AreaTypes.Within:
            spatialFilter = `FILTER (geof:sfWithin("${shape}"^^geo:wktLiteral, ?wkt))`;
            break;
        case AreaTypes.Nearby:
            spatialFilter = `FILTER (spatialF:nearby("${shape}"^^geo:wktLiteral, ?wkt, ${radius}, unit:kilometre))`;
            break;
        case AreaTypes.Overlaps:
            spatialFilter = `FILTER (geof:sfOverlaps("${shape}"^^geo:wktLiteral, ?wkt))`;
            break;
        default:
            spatialFilter = '';
    }

    return `PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX spatialF: <http://jena.apache.org/function/spatial#>
    PREFIX unit: <http://www.opengis.net/def/uom/OGC/1.0/>
    SELECT ?f_uri ?wkt ?fc ?fc_label ?f_label
    WHERE {
        VALUES ?fc {${featureCollections.map(fc => `<${fc}>`).join(' ')}}
        ?fc rdfs:member ?f_uri .
        ?f_uri geo:hasGeometry/geo:asWKT ?wkt .

        OPTIONAL {
            ?f_uri <${config.props.fLabel}> ?f_label .
        }

        OPTIONAL {
            ?fc <${config.props.fcLabel}> ?fc_label .
        }

        ${spatialFilter}
    }
    LIMIT ${limit}`;
};