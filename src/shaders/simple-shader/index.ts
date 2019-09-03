import { Shader } from '../../core/shader';
import { loadShader } from '../../helpers/webgl';

import fSource from './fragmentShader.glsl';
import vSource from './vertexShader.glsl';
import { Renderer } from '../../core/renderer';
import { Asset } from '../../core/asset';
import { mat4, vec3 } from 'gl-matrix';
import { degreeToRadian } from '../../helpers/math';

export class SimpleShader extends Shader {

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

        this.vertexPositionLocation = this.gl.getAttribLocation(this.program, 'aVertexPosition');
        this.vertexColorLocation    = this.gl.getAttribLocation(this.program, 'aVertexColor');
        this.projectionLocation     = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'uProjectionMatrix');
        this.modelViewLocation      = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'uModelViewMatrix');
    }
    
    public execute(assets: Array<Asset>, projectionMatrix: mat4): void {
        const vertexComponents  = 3;
        const type              = this.gl.FLOAT;
        const normalize         = false;
        const stride            = 0;
        const offset            = 0;
        const colorComponents   = 4;

        this.gl.useProgram(this.program);
        
        for(const asset of assets) {
            const positionBuffer    = this.dataBuffers[asset.positionIndex];
            const colorBuffer       = this.dataBuffers[asset.colorIndex];
            const modelViewMatrix   = mat4.create();
            const translate         = vec3.fromValues(asset.x, asset.y, asset.z);
            const rotationX         = degreeToRadian(asset.rotation.x);
            const rotationY         = degreeToRadian(asset.rotation.y);
            const rotationZ         = degreeToRadian(asset.rotation.z);

            if (positionBuffer == null || colorBuffer == null) {
                console.warn('Requested position buffer not found. Buffer Index: ' + asset.positionIndex);

                continue;
            }

            mat4.translate(modelViewMatrix, modelViewMatrix, translate);
            mat4.rotate(modelViewMatrix, modelViewMatrix, rotationX, [ 1, 0, 0 ]);
            mat4.rotate(modelViewMatrix, modelViewMatrix, rotationY, [ 0, 1, 0 ]);
            mat4.rotate(modelViewMatrix, modelViewMatrix, rotationZ, [ 0, 0, 1 ]);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
            this.gl.enableVertexAttribArray(this.vertexPositionLocation);
            this.gl.vertexAttribPointer(this.vertexPositionLocation, vertexComponents, type, normalize, stride, offset);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
            this.gl.enableVertexAttribArray(this.vertexColorLocation);
            this.gl.vertexAttribPointer(this.vertexColorLocation, colorComponents, type, normalize, stride, offset);

            this.gl.uniformMatrix4fv(this.projectionLocation, false, projectionMatrix);
            this.gl.uniformMatrix4fv(this.modelViewLocation, false, modelViewMatrix);

            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, asset.positionLength / vertexComponents);
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

    

    private vertexColorLocation: number;
    private vertexPositionLocation: number;
    private projectionLocation: WebGLUniformLocation;
    private modelViewLocation: WebGLUniformLocation;

    private fShader: WebGLShader;
    private vShader: WebGLShader;
    private program: WebGLProgram;
}