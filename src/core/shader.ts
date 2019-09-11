import { Renderer } from './renderer';
import { Asset } from './asset';
import { mat4 } from 'gl-matrix';

export abstract class Shader {
    protected constructor(protected renderer: Renderer) {
        this.gl             = renderer.getContext();
        this.dataBuffers    = renderer.getDataBuffers();
    }

    abstract execute(assets: Array<Asset>, projectionMatrix: mat4, viewMatrix: mat4): void;

    abstract delete(): void;

    protected dataBuffers: Array<WebGLBuffer>;
    protected gl: WebGLRenderingContext;
}