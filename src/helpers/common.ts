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

export const createGrid = (dimension: number): Obj => {
    const vertices = new Array<number>();
    const indices  = new Array<number>();
    const texels   = new Array<number>();
    const ringSize = dimension / 4;
    const faces    = 2 * dimension * dimension;

    for(let i = 0; i <= dimension; i++) {
        for(let j = 0; j <= dimension; j++) {
            if (i > ringSize && i < dimension - ringSize && j > ringSize && j < dimension - ringSize) continue;

            vertices.push((j * 2) / dimension - 1, (i * 2) / dimension - 1);
            texels.push(j / dimension, i / dimension);
        }
    }

    for(let i = 0, l = 0; i < faces / 2; i++) {
        const col           = i % dimension;
        const row           = Math.floor(i / dimension);
        const startIndex    = i + row;
        const bottomIndex   = (row + 1) * (dimension + 1) + col;

        if (row >= ringSize && row < dimension - ringSize && col >= ringSize && col < dimension - ringSize) {
            console.log(i, row, col, l, startIndex, bottomIndex, 'miss');
            l += 1;
            continue;
        }
        else {
            console.log(i, row, col, l, startIndex, bottomIndex, 'ok');
        }

        indices.push(
            startIndex, bottomIndex - l, startIndex + 1,
            startIndex + 1, bottomIndex - l, bottomIndex - l + 1
        );

        if (i == 7) break;
    }

    console.log(dimension, vertices, texels, indices);

    return {
        vertices: new Float32Array(vertices),
        texels: new Float32Array(texels),
        normals: new Float32Array(),
        indices: new Uint16Array(indices)
    }
}