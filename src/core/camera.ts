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
        const cameraMatrix      = mat4.create();

        mat4.translate(cameraMatrix, cameraMatrix, this.position);
        mat4.rotateX(cameraMatrix, cameraMatrix, degreeToRadian(this.rotation[0]));
        mat4.rotateY(cameraMatrix, cameraMatrix, degreeToRadian(this.rotation[1]));
        mat4.rotateZ(cameraMatrix, cameraMatrix, degreeToRadian(this.rotation[2]));

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