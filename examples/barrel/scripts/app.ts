import { Renderer, Geometry, AssetShader, parseObj } from '../../../src';
import barrel from '../res/barrel.obj';
import * as barrelTx from '../res/barrel_tx_base.png';

const canvas    = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width    = document.documentElement.clientWidth;
canvas.height   = document.documentElement.clientHeight - 3;

const renderer              = new Renderer(canvas);
const assetShader           = new AssetShader(renderer);
const shaderIndex           = renderer.registrShader(assetShader);
const camera                = renderer.getCamera();
const barrelObj             = parseObj(barrel);
const barrelPositionIndex   = renderer.createArrayBuffer(barrelObj.vertices);
const barrelTexelsIndex     = renderer.createArrayBuffer(barrelObj.texels);
const barrelNormalsIndex    = renderer.createArrayBuffer(barrelObj.normals);
const barrelFacesIndex      = renderer.createElementsBuffer(barrelObj.indices);
const barrelTextureIndex    = renderer.createTexture(barrelTx);

const barrelAsset = new Geometry(
    [0, 0, 0],      // translate
    [0, 0, 0],      // rotate
    [2, 2, 2],      // scale
    [0, 4, 10],     // lightDirection
    barrelTexelsIndex,
    barrelTextureIndex,
    barrelNormalsIndex,
    barrelFacesIndex,
    barrelPositionIndex,
    barrelObj.indices.length
);

camera.setTarget(barrelAsset.position);
camera.setDistance(-10);
camera.setHeight(0);
camera.update();

renderer.addAsset(shaderIndex, barrelAsset);
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