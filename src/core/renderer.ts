import { degreeToRadian, isPowerOf2 } from '../helpers/math';
import { mat4 } from 'gl-matrix';

import { Geometry } from './geometry';
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
        this.shaderAssetsContainer  = new Array<Array<Geometry>>();
        this.shadersContainer       = new Array<Shader>();
        this.dataBuffers            = new Array<WebGLBuffer>();
        this.texturesContainer      = new Array<WebGLTexture>();
    }

    public addAsset(shaderIndex: number, asset: Geometry): void {
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

        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);

        const aspect                = this.gl.canvas.width / this.gl.canvas.height;
        const zNear                 = 0.1;
        const zFar                  = 100.0;
        const fov                   = 45;
        const projectionMatrix      = mat4.create();
        const viewMatrix            = this.camera.getViewMatrix();

        mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);

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

        this.shaderAssetsContainer[shaderIndex] = new Array<Geometry>();

        return shaderIndex;
    }

    public getCamera(): Camera {
        return this.camera;
    }

    public setCamera(camera: Camera): void {
        this.camera = camera;
    }

    public createArrayBuffer(data: Float32Array | Uint16Array): number {
        const buffer = <WebGLBuffer>this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

        return this.dataBuffers.push(buffer) - 1;
    }

    public createElementsBuffer(data: Float32Array | Uint16Array): number {
        const buffer = <WebGLBuffer>this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

        return this.dataBuffers.push(buffer) - 1;
    }

    public createTexture(txSource: string): number {
        const texture           = <WebGLTexture>this.gl.createTexture();
        const image             = new Image();
        const level             = 0;
        const internalFormat    = this.gl.RGBA;
        const srcFormat         = this.gl.RGBA;
        const srcType           = this.gl.UNSIGNED_BYTE;

        image.onload = () => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
            } 
            else {
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            }
        };

        image.src = txSource;

        return this.texturesContainer.push(texture) - 1;
    }

    public getDataBuffers(): Array<WebGLBuffer> {
        return this.dataBuffers;
    }

    public getTexturesContainer(): Array<WebGLTexture> {
        return this.texturesContainer;
    }

    private dataBuffers: Array<WebGLBuffer>;
    private texturesContainer: Array<WebGLTexture>;

    private shaderAssetsContainer: Array<Array<Geometry>>;
    private shadersContainer: Array<Shader>;

    private camera: Camera;
    private backgroundColor: Float32Array;

    private gl: WebGLRenderingContext;
}