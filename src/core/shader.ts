import { Renderer } from './renderer';
import { Asset } from './asset';
import { mat4 } from 'gl-matrix';

export abstract class Shader {
    protected constructor(protected renderer: Renderer) {
        this.gl             = renderer.getContext();
        this.dataBuffers    = new Array<WebGLBuffer>();
    }

    abstract execute(assets: Array<Asset>, projectionMatrix: mat4, viewMatrix: mat4): void;

    abstract delete(): void;

    public registrData(data: Float32Array): number {
        const buffer = <WebGLBuffer>this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

        return this.dataBuffers.push(buffer) - 1;
    }

    protected dataBuffers: Array<WebGLBuffer>;
    protected gl: WebGLRenderingContext;
}