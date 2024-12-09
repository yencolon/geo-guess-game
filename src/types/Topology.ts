interface Topology {
    type: string;
    objects: Record<string, GeometryCollection>;
    arcs: number[][][];
    bbox: number[];
}

interface GeometryCollection {
    type: string;
    geometries: Geometry[];
}

interface Geometry {
    type: string;
    arcs: number | number[] | number[][];
    id: string;
    properties: Properties;
}

interface Properties {
    name: string;
    selected?: boolean;
}

export default Topology;