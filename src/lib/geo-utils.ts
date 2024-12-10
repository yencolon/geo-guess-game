import Coordinate from "@/types/Coordinates";

const calculateGeometryCentroid = (arc: any, type: string, arcs: any): Coordinate => {
    const coordinates = extractCoordinates(arc, type, arcs);
    return calculateCentroid(coordinates);
}

const extractCoordinates = (arc: any, type: string, arcs: any): Coordinate[] => {
    let flatCoordinates: number[] = [];

    if (type === "Polygon") {
        flatCoordinates = arc[0].flat();
    } else if (type === "MultiPolygon") {
        flatCoordinates = arc[0][0].flat();
    }

    return flatCoordinates.map(coordIndex => arcs[Math.abs(coordIndex)])
        .flat()
        .map(coord => ({ longitude: coord[0], latitude: coord[1] }));
}

const calculateCentroid = (coords: Coordinate[]): Coordinate => {
    const totalLat = coords.reduce((sum, coord) => sum + coord.latitude, 0);
    const totalLon = coords.reduce((sum, coord) => sum + coord.longitude, 0);

    return {
        latitude: totalLat / coords.length,
        longitude: totalLon / coords.length,
    };
}

export { calculateGeometryCentroid, extractCoordinates, calculateCentroid }