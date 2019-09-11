import { Renderer, Asset, ElementShader, SimpleShader } from '../../src';
import { degreeToRadian } from '../../src/helpers/math';


const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight - 3;

const renderer          = new Renderer(canvas);
const elementShader     = new ElementShader(renderer);
const simpleShader      = new SimpleShader(renderer);
const shaderIndex       = renderer.registrShader(elementShader);
const camera            = renderer.getCamera();

const cubePositions = new Float32Array([
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
]);
const cubeIndeces = new Uint16Array([
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
]);
const cubeColors = new Float32Array([
    0.0,  1.0,  1.0,  1.0,    // 
    0.0,  1.0,  1.0,  1.0,    // 
    0.0,  1.0,  1.0,  1.0,    // 
    0.0,  1.0,  1.0,  1.0,    // 

    1.0,  0.0,  0.0,  1.0,    // red
    1.0,  0.0,  0.0,  1.0,    // red
    1.0,  0.0,  0.0,  1.0,    // red
    1.0,  0.0,  0.0,  1.0,    // red

    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  1.0,  0.0,  1.0,    // green

    0.0,  0.0,  1.0,  1.0,    // blue
    0.0,  0.0,  1.0,  1.0,    // blue
    0.0,  0.0,  1.0,  1.0,    // blue
    0.0,  0.0,  1.0,  1.0,    // blue

    1.0,  0.0,  1.0,  1.0,    //
    1.0,  0.0,  1.0,  1.0,    //
    1.0,  0.0,  1.0,  1.0,    //
    1.0,  0.0,  1.0,  1.0,    //

    1.0,  1.0,  0.0,  1.0,    //
    1.0,  1.0,  0.0,  1.0,    //
    1.0,  1.0,  0.0,  1.0,    //
    1.0,  1.0,  0.0,  1.0,    // 
]);
const cubePositionIndex = renderer.createArrayBuffer(cubePositions);
const cubeColorsIndex   = renderer.createArrayBuffer(cubeColors);
const cubeFacesIndex    = renderer.createElementsBuffer(cubeIndeces);
const cubeAsset = new Asset(
    [0, 0, 0],
    [0, 0, 0],
    0,
    cubeColorsIndex,
    cubeFacesIndex,
    cubePositionIndex,
    cubeIndeces.length,
);

camera.setTarget(cubeAsset.position);
camera.setDistance(-10);
camera.setHeight(-3);
camera.update();

renderer.addAsset(shaderIndex, cubeAsset);
renderer.setBackgroundColor(new Float32Array([0.9, 0.9, 0.9]));

for(let i = 0; i < 100; i += 5) {
    const asset = new Asset(
        [i, 0, -15],
        [0, 0, 0],
        0,
        cubeColorsIndex,
        cubeFacesIndex,
        cubePositionIndex,
        cubeIndeces.length,
    );

    renderer.addAsset(shaderIndex, asset);
}

document.onkeydown = (event: KeyboardEvent): void => {
    if (event.which == 38) {
        cubeAsset.position[2] -= Math.cos(degreeToRadian(cubeAsset.rotation[1])) * 1;
        cubeAsset.position[0] -= Math.sin(degreeToRadian(cubeAsset.rotation[1])) * 1;
    }
    else if (event.which == 40) {
        cubeAsset.position[2] += Math.cos(degreeToRadian(cubeAsset.rotation[1])) * 1;
        cubeAsset.position[0] += Math.sin(degreeToRadian(cubeAsset.rotation[1])) * 1;
    }

    cubeAsset.update();
    camera.update();
}

document.onmousemove = (event: MouseEvent): void => {
    cubeAsset.rotation[1] += event.movementX;

    camera.setAngle(cubeAsset.rotation[1]);

    cubeAsset.update();
    camera.update();
}

const renderLoop = (): void => {
    renderer.render();

    requestAnimationFrame(renderLoop)
};

requestAnimationFrame(renderLoop);