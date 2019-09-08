import { vec3, mat4, mat3, quat } from "gl-matrix";
import { degreeToRadian } from "../helpers/math";

export class Camera {
    public constructor() {
        this.target     = vec3.create();
        this.viewMatrix = this.computeViewMatrix();
        this.distance   = 0;
        this.height     = 0;
        this.angle      = 0;
    }

    public getViewMatrix(): mat4 {
        return this.viewMatrix;
    }

    public update(): void {
        this.viewMatrix = this.computeViewMatrix();
    }

    private computeViewMatrix(): mat4 {
        const viewMatrix    = mat4.create();
        const position      = vec3.create();
        const target        = this.target;
        
        vec3.subtract(position, target, [ 0, this.height, this.distance]);
        vec3.rotateY(position, position, target, degreeToRadian(this.angle));
        
        mat4.lookAt(viewMatrix, position, target, [0, 1, 0]);

        return viewMatrix;
    }

    public setAngle(degree: number): void {
        this.angle = degree;
    }

    public setDistance(distance: number): void {
        this.distance = distance;
    }

    public setHeight(height: number): void {
        this.height = height;
    }

    public setTarget(target: vec3 | number[]) {
        this.target = target;
    }

    private height: number;
    private distance: number;
    private angle: number;
    private target: vec3 | number[];
    private viewMatrix: mat4;
}