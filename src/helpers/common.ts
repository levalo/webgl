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

interface VertexGrid {
    vertices: Float32Array,
    indices: Uint16Array
}

export const createGrid = (width: number, height: number, tileSize: number): Obj => {
    const vertices      = new Array<number>();
    const indices       = new Array<number>();
    const texels        = new Array<number>();
    const tilesInRow    = width / tileSize;
    const tilesInColumn = height / tileSize;
    const faces         = 2 * tilesInRow * tilesInColumn;

    for(let i = 0; i <= width; i += tileSize) {
        for(let j = 0; j <= height; j += tileSize) {
            vertices.push(((i * 2) / height) - 1,  ((j * 2) / width) - 1);
        }
    }

    for(let i = 0; i <= width; i += tileSize) {
        for(let j = 0; j <= height; j += tileSize) {
            texels.push(i / height,  j / width);
        }
    }

    for(let i = 0; i < faces / 2; i++) {
        const startIndex = i + Math.floor(i / tilesInRow);

        indices.push(
            startIndex, startIndex + 1, startIndex + tilesInRow + 1
        );
    }

    for(let i = 0; i < faces / 2; i++) {
        const startIndex = i + Math.floor(i / tilesInRow) + 1;

        indices.push(
            startIndex, startIndex + tilesInRow + 1, startIndex + tilesInRow
        );
    }

    return {
        vertices: new Float32Array(vertices),
        texels: new Float32Array(texels),
        normals: new Float32Array(),
        indices: new Uint16Array(indices)
    }
}