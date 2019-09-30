import { Renderer, Asset, ElementShader, SimpleShader } from '../../src';
import box from './barrel.obj';
import * as boxTx from './barrel_tx_base.png';
import { parseObj } from '../../src/helpers/webgl';
import { mat4, vec3 } from 'gl-matrix';

const canvas    = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width    = document.documentElement.clientWidth;
canvas.height   = document.documentElement.clientHeight - 3;

const renderer              = new Renderer(canvas);
const elementShader         = new ElementShader(renderer);
const shaderIndex           = renderer.registrShader(elementShader);
const camera                = renderer.getCamera();
const boxObj                = parseObj(box);
const boxPositionIndex      = renderer.createArrayBuffer(boxObj.vertices);
const boxTexelsIndex        = renderer.createArrayBuffer(boxObj.texels);
const boxNormalsIndex       = renderer.createArrayBuffer(boxObj.normals);
const boxFacesIndex         = renderer.createElementsBuffer(boxObj.indices);
const boxColors             = new Array<number>();
const boxTextureIndex       = renderer.createTexture(boxTx);

for(let i = 0; i < boxObj.vertices.length; i += 3) {
    boxColors.push(boxObj.vertices[i],  boxObj.vertices[i],  boxObj.vertices[i],  1.0);
}

const boxColorsIndex = renderer.createArrayBuffer(new Float32Array(boxColors));
const lightDirection = vec3.fromValues(0, 4, 10);

const boxAsset = new Asset(
    [0, 0, 0],      // translate
    [0, 0, 0],    // rotate
    [2, 2, 2],      // scale
    lightDirection,
    boxColorsIndex,
    boxTexelsIndex,
    boxTextureIndex,
    boxNormalsIndex,
    boxFacesIndex,
    boxPositionIndex,
    boxObj.indices.length,
);

camera.setTarget(boxAsset.position);
camera.setDistance(-10);
camera.setHeight(-3);
camera.update();

renderer.addAsset(shaderIndex, boxAsset);
renderer.setBackgroundColor(new Float32Array([0.9, 0.9, 0.9]));

document.onmousedown = (event: MouseEvent): void => {
    document.onmousemove = (event: MouseEvent): void => {
        camera.addAngleY(-1 * event.movementX);
        camera.addAngleX(-1 * event.movementY);
    
        camera.update();
    }
}

document.onmouseup = (event: MouseEvent): void => {
    document.onmousemove = null;
}

document.onwheel = (event: WheelEvent): void => {
    camera.addDistance(event.deltaY);

    camera.update();
}

const renderLoop = (): void => {
    renderer.render();

    requestAnimationFrame(renderLoop)
};

requestAnimationFrame(renderLoop);