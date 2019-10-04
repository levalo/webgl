import { vec3, mat4, quat } from "gl-matrix";

export class Asset {
    public constructor(
        public position: vec3 | number[],
        public rotation: vec3 | number[],
        public scale: vec3 | number[],
        public lightDirection: vec3 | number[],
        public texelsIndex: number,
        public textureIndex: number,
        public normalsIndex: number,
        public faceIndex: number,
        public positionIndex: number,
        public vertexCount: number,
    ) { 
        this.modelViewMatrix = this.computeModelViewMatrix();
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