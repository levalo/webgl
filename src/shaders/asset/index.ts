import { Shader } from '../../core/shader';
import { loadShader } from '../../helpers/webgl';

import fSource from './fragmentShader.glsl';
import vSource from './vertexShader.glsl';
import { Renderer } from '../../core/renderer';
import { Geometry } from '../../core/geometry';
import { mat4, vec3 } from 'gl-matrix';

export class AssetShader extends Shader {

    public constructor(renderer: Renderer) {
        super(renderer);

        this.fShader            = loadShader(this.gl, this.gl.FRAGMENT_SHADER, fSource),
        this.vShader            = loadShader(this.gl, this.gl.VERTEX_SHADER, vSource),
        this.program            = <WebGLProgram>this.gl.createProgram();
        
        this.gl.attachShader(this.program, this.vShader);
        this.gl.attachShader(this.program, this.fShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            this.delete();

            throw new Error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(this.program));
        }

        this.vertexPositionLocation         = this.gl.getAttribLocation(this.program, 'aVertexPosition');
        this.normalLocation                 = this.gl.getAttribLocation(this.program, 'aNormal');
        this.texelCoordLocation             = this.gl.getAttribLocation(this.program, 'aTexelCoord');
        this.projectionLocation             = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'uProjectionMatrix');
        this.viewLocation                   = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'uViewMatrix');
        this.modelViewLocation              = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'uModelViewMatrix');
        this.samplerLocation                = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'uSampler');
        this.reverseLightDirectionLoaction  = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'uReverseLightDirection');
    }
    
    public execute(assets: Array<Geometry>, projectionMatrix: mat4, viewMatrix: mat4): void {
        const vertexComponents  = 3;
        const textureComponents = 2;
        const type              = this.gl.FLOAT;
        const normalize         = false;
        const stride            = 0;
        const offset            = 0;

        this.gl.useProgram(this.program);
        
        for(const asset of assets) {
            const positionBuffer    = this.dataBuffers[asset.positionsIndex];
            const texelsBuffer      = this.dataBuffers[asset.texelsIndex];
            const normalsBuffer     = this.dataBuffers[asset.normalsIndex];
            const indecesBuffer     = this.dataBuffers[asset.facesIndex];
            const texture           = this.textureContainer[asset.textureIndex];
            const modelViewMatrix   = asset.getModelViewMatrix();
            const lightDirection    = vec3.create();

            vec3.normalize(lightDirection, asset.lightDirection);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
            this.gl.enableVertexAttribArray(this.vertexPositionLocation);
            this.gl.vertexAttribPointer(this.vertexPositionLocation, vertexComponents, type, normalize, stride, offset);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texelsBuffer);
            this.gl.enableVertexAttribArray(this.texelCoordLocation);
            this.gl.vertexAttribPointer(this.texelCoordLocation, textureComponents, type, normalize, stride, offset);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalsBuffer);
            this.gl.enableVertexAttribArray(this.normalLocation);
            this.gl.vertexAttribPointer(this.normalLocation, vertexComponents, type, normalize, stride, offset);

            this.gl.uniformMatrix4fv(this.projectionLocation, false, projectionMatrix);
            this.gl.uniformMatrix4fv(this.viewLocation, false, viewMatrix);
            this.gl.uniformMatrix4fv(this.modelViewLocation, false, modelViewMatrix);
            this.gl.uniform1i(this.samplerLocation, 0);
            this.gl.uniform3fv(this.reverseLightDirectionLoaction, lightDirection);

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indecesBuffer);

            this.gl.drawElements(this.gl.TRIANGLES, asset.vertexCount, this.gl.UNSIGNED_SHORT, 0);
        }
    }

    public delete(): void {
        if (this.program != null) this.gl.deleteProgram(this.program);
        if (this.fShader != null) this.gl.deleteShader(this.fShader);
        if (this.vShader != null) this.gl.deleteShader(this.vShader);

        for (const buffer in this.dataBuffers) {
            this.gl.deleteBuffer(buffer);
        }
    }

    

    private texelCoordLocation: number;
    private normalLocation: number;
    private vertexPositionLocation: number;
    private projectionLocation: WebGLUniformLocation;
    private viewLocation: WebGLUniformLocation;
    private modelViewLocation: WebGLUniformLocation;
    private samplerLocation: WebGLUniformLocation;
    private reverseLightDirectionLoaction: WebGLUniformLocation;

    private fShader: WebGLShader;
    private vShader: WebGLShader;
    private program: WebGLProgram;
}