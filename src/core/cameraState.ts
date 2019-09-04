import { vec3 } from "gl-matrix";

export interface CameraState {
    zFar: number;
    fov: number;
    position: vec3;
    rotation: vec3;
}