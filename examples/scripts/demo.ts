import { Renderer, SimpleShader } from '../../src';


const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight - 3;

const renderer      = new Renderer(canvas);
const simpleShader  = new SimpleShader(renderer);
const shaderIndex   = renderer.registrShader(simpleShader);
const camera        = renderer.getCamera();
const cameraState   = camera.getState();

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
const cubePositionIndex = simpleShader.registrData(cubePositions);
const cubeColorsIndex = simpleShader.registrData(cubeColors);

for(let i = -100; i < 100; i += 7) {
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
        x: i,
        y: 0.0, 
        z: 0.0
    };

    renderer.addAsset(shaderIndex, cubeAsset);
}

renderer.setBackgroundColor(new Float32Array([0.9, 0.9, 0.9]));

cameraState.position[2] = 5;
camera.update();

document.onkeydown = (event: KeyboardEvent): void => {
    if (event.which == 39) {
        cameraState.rotation[1] += 1.5;
    }
    else if (event.which == 37) {
        cameraState.rotation[1] -= 1.5;
    }
    else if (event.which == 38) {
        cameraState.position[2] -= 0.1;
    }
    else if (event.which == 40) {
        cameraState.position[2] += 0.1;
    }

    camera.update();
}

const renderLoop = (): void => {
    renderer.render();

    requestAnimationFrame(renderLoop)
};

requestAnimationFrame(renderLoop);