import { degreeToRadian } from '../helpers/math';
import { mat4 } from 'gl-matrix';

import { Asset } from './asset';
import { Shader } from './shader';
import { Camera } from './camera';

export class Renderer {
    public constructor(canvas: HTMLCanvasElement) {
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if (gl === null) {
            throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
        }

        this.gl                     = <WebGLRenderingContext>gl;
        this.camera                 = new Camera();
        this.backgroundColor        = new Float32Array(3);
        this.shaderAssetsContainer  = new Array<Array<Asset>>();
        this.shadersContainer       = new Array<Shader>();
    }

    public addAsset(shaderIndex: number, asset: Asset): void {
        const assetsContainer = this.shaderAssetsContainer[shaderIndex];

        if (assetsContainer == null) {
            console.error("Can't add asset. Invalid shaderIndex. Check if shader is registred.");

            return;
        }

        assetsContainer.push(asset);
    }

    public render(): void {
        this.gl.clearColor(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2], 1.0);
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        //this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);

        const aspect                = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const zNear                 = 0.1;
        const zFar                  = 100.0;
        const fov                   = 45;
        const cameraMatrix          = this.camera.getCameraMatrix();
        const projectionMatrix      = mat4.create();
        const viewMatrix            = mat4.create();

        mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);
        mat4.invert(viewMatrix, cameraMatrix);

        for(let i = 0; i < this.shadersContainer.length; i++) {
            const shader        = this.shadersContainer[i];
            const shaderAssets  = this.shaderAssetsContainer[i];

            shader.execute(shaderAssets, projectionMatrix, viewMatrix);
        }
    }

    public setBackgroundColor(color: Float32Array): void {
        this.backgroundColor = color;
    }

    public getContext(): WebGLRenderingContext {
        return this.gl;
    }

    public registrShader(shader: Shader): number {
        const shaderIndex = this.shadersContainer.push(shader) - 1;

        this.shaderAssetsContainer[shaderIndex] = new Array<Asset>();

        return shaderIndex;
    }

    public getCamera(): Camera {
        return this.camera;
    }

    public setCamera(camera: Camera): void {
        this.camera = camera;
    }

    private shaderAssetsContainer: Array<Array<Asset>>;
    private shadersContainer: Array<Shader>;

    private camera: Camera;
    private backgroundColor: Float32Array;

    private gl: WebGLRenderingContext;
}