import { vec3 } from "gl-matrix";

export interface Asset {
    positionLength: number;
    positionIndex: number;
    colorIndex: number;
    rotation: vec3 | number[];
    scale: number;
    position: vec3 | number[];
}