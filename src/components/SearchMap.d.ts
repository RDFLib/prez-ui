export enum AreaTypes {
    Nearby='Nearby',
    Contains='Contains',
    Overlaps='Overlaps',
    Within='Within'
}

export type Coords = Coord[]

export type Coord = [number, number]

export enum ShapeTypes {
    None='No selection', Point='Point selected', Polygon='Polygon selected'
}
