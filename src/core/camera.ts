import { vec3, mat4 } from "gl-matrix";
import { CameraState } from "./cameraState";
import { degreeToRadian } from "../helpers/math";

export class Camera {
    public constructor(private gl: WebGLRenderingContext) {
        this.state = {
            zFar: 100.0,
            fov: degreeToRadian(90),
            position: vec3.create(),
            rotation: vec3.create()
        };

        this.viewProjectionMatrix = this.computeViewProjectionMatrix();
    }

    public getState(): CameraState {
        return this.state;
    }

    public getViewProjectionMatrix(): mat4 {
        return this.viewProjectionMatrix;
    }

    public update(): void {
        this.viewProjectionMatrix = this.computeViewProjectionMatrix();
    }

    private computeViewProjectionMatrix(): mat4 {
        const aspect                = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const zNear                 = 0.1;
        const zFar                  = this.state.zFar;
        const fov                   = this.state.fov;
        const projectionMatrix      = mat4.create();
        const cameraMatrix          = mat4.create();
        const viewMatrix            = mat4.create();
        const cameraRotation        = this.state.rotation;
        const cameraPosition        = this.state.position;
        const viewProjectionMatrix  = mat4.create();

        mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);
        mat4.translate(cameraMatrix, cameraMatrix, cameraPosition);
        mat4.rotateX(cameraMatrix, cameraMatrix, degreeToRadian(cameraRotation[0]));
        mat4.rotateY(cameraMatrix, cameraMatrix, degreeToRadian(cameraRotation[1]));
        mat4.rotateZ(cameraMatrix, cameraMatrix, degreeToRadian(cameraRotation[2]));
        mat4.invert(viewMatrix, cameraMatrix);
        mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

        return viewProjectionMatrix;
    }

    private viewProjectionMatrix: mat4;
    private state: CameraState;
}