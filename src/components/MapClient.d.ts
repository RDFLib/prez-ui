
/** Used by mapping UI implementations */
export enum AreaTypes {
    Nearby='Nearby',
    Contains='Contains',
    Overlaps='Overlaps',
    Within='Within'
}

/** this array holds the lat/long coords for a point or set of points */
export type Coords = Coord[]

/** lat & long */
export type Coord = [number, number]

/** the different selectable shape types from the google map */
export enum ShapeTypes {
    None='No selection', Point='Point selected', Polygon='Polygon selected', Rectangle='Rectangle selected'
}

export type DrawingModes = 'MARKER' | 'RECTANGLE' | 'POLYGON'
