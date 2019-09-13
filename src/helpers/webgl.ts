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
    indices: Uint16Array
}

export const parseObj = (objSource: string): Obj => {
    const vertices = new Array<number>();
    const indices  = new Array<number>();

    objSource.split('\n').forEach(line => {
        if (line.startsWith('v ')) {
            vertices.push(...line.replace('v ', '').split(' ').map(Number));
        }

        if (line.startsWith('f ')) {
            indices.push(...line.replace('f ', '').split(' ').map(chunk => {
                return chunk.split('/').map(Number);
            }).map(face => face[0] - 1));
        }
    });

    return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
}