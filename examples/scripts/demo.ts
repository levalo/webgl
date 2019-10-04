import { Renderer, Asset, AssetShader } from '../../src';
import box from './barrel.obj';
import * as boxTx from './barrel_tx_base.png';
import { parseObj } from '../../src/helpers/webgl';
import { vec3 } from 'gl-matrix';

const canvas    = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width    = document.documentElement.clientWidth;
canvas.height   = document.documentElement.clientHeight - 3;

const renderer              = new Renderer(canvas);
const assetShader           = new AssetShader(renderer);
const shaderIndex           = renderer.registrShader(assetShader);
const camera                = renderer.getCamera();
const boxObj                = parseObj(box);
const boxPositionIndex      = renderer.createArrayBuffer(boxObj.vertices);
const boxTexelsIndex        = renderer.createArrayBuffer(boxObj.texels);
const boxNormalsIndex       = renderer.createArrayBuffer(boxObj.normals);
const boxFacesIndex         = renderer.createElementsBuffer(boxObj.indices);
const boxTextureIndex       = renderer.createTexture(boxTx);

const lightDirection = vec3.fromValues(0, 4, 10);

const boxAsset = new Asset(
    [0, 0, 0],      // translate
    [0, 0, 0],      // rotate
    [2, 2, 2],      // scale
    lightDirection,
    boxTexelsIndex,
    boxTextureIndex,
    boxNormalsIndex,
    boxFacesIndex,
    boxPositionIndex,
    boxObj.indices.length,
);

camera.setTarget(boxAsset.position);
camera.setDistance(-10);
camera.setHeight(0);
camera.update();

renderer.addAsset(shaderIndex, boxAsset);
renderer.setBackgroundColor(new Float32Array([0.9, 0.9, 0.9]));

let cameraAngleX = 0;
let cameraAngleY = 0;
camera.setAngleX(cameraAngleX);
camera.setAngleY(cameraAngleY);
camera.update();

document.onmousedown = (event: MouseEvent): void => {
    document.onmousemove = (event: MouseEvent): void => {
        const angleX = cameraAngleX + event.movementY * -1;
        const angleY = cameraAngleY + event.movementX * -1;

        if (angleX < 0) {
            cameraAngleX = Math.max(angleX, -80);
        }
        else {
            cameraAngleX = Math.min(angleX, 80);
        }

        cameraAngleY = angleY < 360 ? angleY : 0;

        camera.setAngleY(cameraAngleY);
        camera.setAngleX(cameraAngleX);
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