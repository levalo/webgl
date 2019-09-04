export interface Asset {
    positionLength: number;
    positionIndex: number;
    colorIndex: number;
    rotation: {
        x: number,
        y: number,
        z: number
    };
    scale: number;
    x: number;
    y: number;
    z: number;
}