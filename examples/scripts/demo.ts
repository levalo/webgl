import { Renderer, Asset, ElementShader, SimpleShader } from '../../src';
import barrel from './barrel.obj';
import { parseObj } from '../../src/helpers/webgl';


const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight - 3;

const renderer          = new Renderer(canvas);
const elementShader     = new ElementShader(renderer);
const shaderIndex       = renderer.registrShader(elementShader);
const camera            = renderer.getCamera();

const barrelObj = parseObj(barrel);
const barrelPositionIndex = renderer.createArrayBuffer(barrelObj.vertices);
const barrelFacesIndex = renderer.createElementsBuffer(barrelObj.indices);
const barrelColors = new Array<number>();

for(let i = 0; i < barrelObj.vertices.length; i += 3) {
    barrelColors.push(Math.random(),  Math.random(),  Math.random(),  1.0);
}

const barrelColorsIndex = renderer.createArrayBuffer(new Float32Array(barrelColors));

const barrelAsset = new Asset(
    [0, 0, 0],
    [0, 0, 0],
    0,
    barrelColorsIndex,
    barrelFacesIndex,
    barrelPositionIndex,
    barrelObj.indices.length,
);

camera.setTarget(barrelAsset.position);
camera.setDistance(-10);
camera.setHeight(-3);
camera.update();

renderer.addAsset(shaderIndex, barrelAsset);
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