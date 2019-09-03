import { Renderer, SimpleShader } from '../../src';


const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight - 3;

const renderer                  = new Renderer(canvas);
const simpleShader              = new SimpleShader(renderer);
const shaderIndex               = renderer.registrShader(simpleShader);

const cubePositions = new Float32Array([
    -1.0, 1.0, 1.0,     1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0,    1.0, -1.0, 1.0,

    -1.0, 1.0, -1.0,    1.0, 1.0, -1.0,
    -1.0, -1.0, -1.0,   1.0, -1.0, -1.0,

    -1.0, 1.0, 1.0,     1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,    1.0, 1.0, -1.0,

    -1.0, -1.0, 1.0,    1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0,   1.0, -1.0, -1.0,

    -1.0, 1.0, 1.0,     -1.0, 1.0, -1.0,
    -1.0, -1.0, 1.0,    -1.0, -1.0, -1.0,

    1.0, 1.0, 1.0,      1.0, 1.0, -1.0,
    1.0, -1.0, 1.0,     1.0, -1.0, -1.0
]);
const cubeColors = new Float32Array([
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  1.0,  1.0,  1.0,    // white

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
const cubePositionIndex = simpleShader.registrData(cubePositions);
const cubeColorsIndex = simpleShader.registrData(cubeColors);
const cubeAsset = {
    positionLength: cubePositions.length,
    positionIndex: cubePositionIndex,
    colorIndex: cubeColorsIndex,
    scale: 1,
    rotation: {
        x: 0,
        y: 0,
        z: 0
    },
    x: 0.0,
    y: 0.0, 
    z: 0.0
}

const cubeAsset2 = {
    positionLength: cubePositions.length,
    positionIndex: cubePositionIndex,
    colorIndex: cubeColorsIndex,
    scale: 1,
    rotation: {
        x: 0,
        y: 0,
        z: 0
    },
    x: 5.0,
    y: 0.0, 
    z: 0.0
}

renderer.setBackgroundColor(new Float32Array([0.1, 0.1, 0.1]));
renderer.addAsset(shaderIndex, cubeAsset);
renderer.addAsset(shaderIndex, cubeAsset2);

let cameraAngle = 0;

document.onkeydown = (event: KeyboardEvent): void => {
    if (event.which == 39) {
        cameraAngle += 1.5;
    }
    else if(event.which == 37) {
        cameraAngle -= 1.5;
    }
}

const renderLoop = (): void => {
    renderer.render();
    renderer.setCameraAngle(cameraAngle);

    cubeAsset.rotation.z += 0.05;
    cubeAsset.rotation.y += 0.1;
    cubeAsset.rotation.x += 0.03;
    requestAnimationFrame(renderLoop)
};

requestAnimationFrame(renderLoop);