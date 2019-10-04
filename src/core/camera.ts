import { vec3, mat4, mat3, quat } from "gl-matrix";
import { degreeToRadian } from "../helpers/math";

export class Camera {
    public constructor() {
        this.target     = vec3.create();
        this.viewMatrix = this.computeViewMatrix();
        this.distance   = 0;
        this.height     = 0;
        this.angleX     = 0;
        this.angleY     = 0;
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
        vec3.rotateX(position, position, target, degreeToRadian(this.angleX));
        vec3.rotateY(position, position, target, degreeToRadian(this.angleY));
        
        mat4.lookAt(viewMatrix, position, target, [0, 1, 0]);

        return viewMatrix;
    }

    public setAngleX(degree: number): void {
        this.angleX = degree;
    }

    public setAngleY(degree: number): void {
        this.angleY = degree;
    }

    public addAngleX(degree: number): void {
        this.angleX += degree;
    }

    public addAngleY(degree: number): void {
        this.angleY += degree;
    }

    public addDistance(distance: number): void {
        this.distance += distance;
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
    private angleX: number;
    private angleY: number;
    private target: vec3 | number[];
    private viewMatrix: mat4;
}