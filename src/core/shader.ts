import { Renderer } from './renderer';
import { Geometry } from './geometry';
import { mat4 } from 'gl-matrix';

export abstract class Shader {
    protected constructor(protected renderer: Renderer) {
        this.gl                 = renderer.getContext();
        this.dataBuffers        = renderer.getDataBuffers();
        this.textureContainer   = renderer.getTexturesContainer();
    }

    abstract execute(assets: Array<Geometry>, projectionMatrix: mat4, viewMatrix: mat4): void;

    abstract delete(): void;

    protected textureContainer: Array<WebGLTexture>;
    protected dataBuffers: Array<WebGLBuffer>;
    protected gl: WebGLRenderingContext;
}