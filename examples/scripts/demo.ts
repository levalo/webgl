import { Renderer, SimpleShader } from '../../src';
import { degreeToRadian } from '../../src/helpers/math';
import { vec3, mat2, mat3 } from 'gl-matrix';


const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight - 3;

const renderer          = new Renderer(canvas);
const simpleShader      = new SimpleShader(renderer);
const shaderIndex       = renderer.registrShader(simpleShader);
const camera            = renderer.getCamera();

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
const cubeAsset = {
    positionLength: cubePositions.length,
    positionIndex: cubePositionIndex,
    colorIndex: cubeColorsIndex,
    scale: 1,
    rotation: [0, 0, 0],
    position: [0, 0, 0]
};

camera.setTarget(cubeAsset.position);
camera.setDistance(-10);
camera.setHeight(-5);
camera.update();

renderer.addAsset(shaderIndex, cubeAsset);
renderer.setBackgroundColor(new Float32Array([0.9, 0.9, 0.9]));

for(let i = 0; i < 100; i += 5) {
    const asset = {
        positionLength: cubePositions.length,
        positionIndex: cubePositionIndex,
        colorIndex: cubeColorsIndex,
        scale: 1,
        rotation: [0, 0, 0],
        position: [i, 0, -15]
    };

    renderer.addAsset(shaderIndex, asset);
}

document.onkeydown = (event: KeyboardEvent): void => {
    if (event.which == 39) {
        cubeAsset.rotation[1] -= 1;

        camera.setAngle(cubeAsset.rotation[1]);
    }
    else if (event.which == 37) {
        cubeAsset.rotation[1] += 1;

        camera.setAngle(cubeAsset.rotation[1]);
    }
    else if (event.which == 38) {
        cubeAsset.position[2] -= Math.cos(degreeToRadian(cubeAsset.rotation[1])) * 1;
        cubeAsset.position[0] -= Math.sin(degreeToRadian(cubeAsset.rotation[1])) * 1;
    }
    else if (event.which == 40) {
        cubeAsset.position[2] += Math.cos(degreeToRadian(cubeAsset.rotation[1])) * 1;
        cubeAsset.position[0] += Math.sin(degreeToRadian(cubeAsset.rotation[1])) * 1;
    }

    camera.update();
}

const renderLoop = (): void => {
    renderer.render();

    requestAnimationFrame(renderLoop)
};

requestAnimationFrame(renderLoop);