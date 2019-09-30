export const loadShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader => {
    const shader = <WebGLShader>gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    return shader;
};

interface Obj {
    vertices: Float32Array,
    indices: Uint16Array,
    texels: Float32Array,
    normals: Float32Array
}

export const parseObj = (objSource: string): Obj => {
    const vertices          = new Array<number>();
    const texels            = new Array<number>();
    const normals           = new Array<number>();
    const indices           = new Array<number[]>();
    const lines             = objSource.split('\n');
    const resultVertices    = new Array<number>();
    const resultTexels      = new Array<number>();
    const resultNormals     = new Array<number>();
    const resultIndeces     = new Array<number>();

    for(let line of lines) {
        if (line.startsWith('v ')) {
            vertices.push(...line.replace('v ', '').split(' ').map(Number));
        }

        if (line.startsWith('vt ')) {
            texels.push(...line.replace('vt ', '').split(' ').map(Number));
        }

        if (line.startsWith('vn ')) {
            normals.push(...line.replace('vn ', '').split(' ').map(Number));
        }

        if (line.startsWith('f ')) {
            indices.push(...line.replace('f ', '').split(' ').map(chunk => {
                return chunk.split('/').map(Number);
            }));
        }
    }

    for(let index of indices) {
        const vertexIndex   = index[0] - 1;
        const texelIndex    = index[1] - 1;
        const normalIndex   = index[2] - 1;


        resultVertices[texelIndex * 3]     = vertices[vertexIndex * 3];
        resultVertices[texelIndex * 3 + 1] = vertices[vertexIndex * 3 + 1];
        resultVertices[texelIndex * 3 + 2] = vertices[vertexIndex * 3 + 2];

        resultNormals[texelIndex * 3]      = normals[normalIndex * 3];
        resultNormals[texelIndex * 3 + 1]  = normals[normalIndex * 3 + 1];
        resultNormals[texelIndex * 3 + 2]  = normals[normalIndex * 3 + 2];

        resultTexels[texelIndex * 2]       = texels[texelIndex * 2];
        resultTexels[texelIndex * 2 + 1]   = texels[texelIndex * 2 + 1];

        resultIndeces.push(texelIndex);
    }


    return { 
        vertices: new Float32Array(resultVertices), 
        indices: new Uint16Array(resultIndeces),
        texels: new Float32Array(resultTexels),
        normals: new Float32Array(resultNormals) 
    };
}