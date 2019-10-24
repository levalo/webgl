import { vec3, mat4, quat } from "gl-matrix";

export class Geometry {
    public constructor(
        position: vec3 | number[],
        rotation: vec3 | number[],
        scale: vec3 | number[],
    );

    public constructor(
        position: vec3 | number[],
        rotation: vec3 | number[],
        scale: vec3 | number[],
        lightDirection: vec3 | number[],
        texelsIndex: number,
        textureIndex: number,
        normalsIndex: number,
        facesIndex: number,
        positionsIndex: number,
        vertexCount: number
    );
    
    public constructor(
        position: vec3 | number[],
        rotation: vec3 | number[],
        scale: vec3 | number[],
        lightDirection: vec3 | number[],
        texelsIndex: number,
        textureIndex: number,
        normalsIndex: number,
        faceIndex: number,
        positionIndex: number,
        vertexCount: number,
        heightmapIndex: number
    );

    constructor(
        public position: vec3 | number[],
        public rotation: vec3 | number[],
        public scale: vec3 | number[],
        public _lightDirection?: vec3 | number[],
        public _texelsIndex?: number,
        public _textureIndex?: number,
        public _normalsIndex?: number,
        public _facesIndex?: number,
        public _positionsIndex?: number,
        public _vertexCount?: number,
        public _heightmapIndex?: number
    ) { 
        this.modelViewMatrix = this.computeModelViewMatrix();
    }

    public get lightDirection(): vec3 | number[] {
        return <vec3 | number[]>this._lightDirection;
    }

    public get texelsIndex(): number {
        return <number>this._texelsIndex;
    }

    public get textureIndex(): number {
        return <number>this._textureIndex;
    }

    public get normalsIndex(): number {
        return <number>this._normalsIndex;
    }

    public get facesIndex(): number {
        return <number>this._facesIndex;
    }

    public get positionsIndex(): number {
        return <number>this._positionsIndex;
    }

    public get vertexCount(): number {
        return <number>this._vertexCount;
    }

    public get heightmapIndex(): number {
        return <number>this._heightmapIndex;
    }

    public update(): void {
        this.modelViewMatrix = this.computeModelViewMatrix();
    }

    public getModelViewMatrix(): mat4 {
        return this.modelViewMatrix;
    }

    protected computeModelViewMatrix(): mat4 {
        const modelViewMatrix   = mat4.create();
        const translate         = this.position;
        const rotationQuat      = quat.create();
        const rotationMatrix    = mat4.create();

        mat4.translate(modelViewMatrix, modelViewMatrix, translate);
        quat.fromEuler(rotationQuat, this.rotation[0], this.rotation[1], this.rotation[2]);
        mat4.fromQuat(rotationMatrix, rotationQuat);
        mat4.multiply(modelViewMatrix, modelViewMatrix, rotationMatrix);
        mat4.scale(modelViewMatrix, modelViewMatrix, [this.scale[0], this.scale[1], this.scale[2]]);

        return modelViewMatrix;
    }

    private modelViewMatrix: mat4;
}