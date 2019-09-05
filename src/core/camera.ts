import { vec3, mat4 } from "gl-matrix";
import { degreeToRadian } from "../helpers/math";

export class Camera {
    public constructor() {
        this.rotation       = vec3.create();
        this.position       = vec3.create();
        this.cameraMatrix   = this.computeCameraMatrix();
    }

    public getCameraMatrix(): mat4 {
        return this.cameraMatrix;
    }

    public update(): void {
        this.cameraMatrix = this.computeCameraMatrix();
    }

    private computeCameraMatrix(): mat4 {
        const cameraMatrix = mat4.create();

        mat4.translate(cameraMatrix, cameraMatrix, this.position);

        mat4.rotate(cameraMatrix, cameraMatrix, degreeToRadian(this.rotation[0]), [1, 0, 0]);
        mat4.rotate(cameraMatrix, cameraMatrix, degreeToRadian(this.rotation[1]), [0, 1, 0]);
        mat4.rotate(cameraMatrix, cameraMatrix, degreeToRadian(this.rotation[2]), [0, 0, 1]);

        return cameraMatrix;
    }

    public getPosition(): vec3 {
        return this.position;
    }

    public getRotation(): vec3 {
        return this.rotation;
    }

    private rotation: vec3;
    private position: vec3;
    private cameraMatrix: mat4;
}