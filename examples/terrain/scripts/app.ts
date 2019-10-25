import { Renderer, createGrid, Geometry, TerrainShader } from '../../../src';
import * as heightmap from '../res/heightmap.png';

const canvas    = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width    = document.documentElement.clientWidth;
canvas.height   = document.documentElement.clientHeight - 3;

const renderer              = new Renderer(canvas);
const terrainShader         = new TerrainShader(renderer);
const shaderIndex           = renderer.registrShader(terrainShader);
const camera                = renderer.getCamera();
const terrainGrid           = createGrid(650, 650, 5);
const terrainHeightmapIndex = renderer.createTexture(heightmap);
const terrainPositionIndex  = renderer.createArrayBuffer(terrainGrid.vertices);
const terrainTexelsIndex    = renderer.createArrayBuffer(terrainGrid.texels);
const terrainFacesIndex     = renderer.createElementsBuffer(terrainGrid.indices);

console.log(terrainGrid);

const terrainAsset = new Geometry(
    [0, 0, 0],      // translate
    [0, 180, 0],      // rotate
    [10, 10, 10],      // scale
    [0, 4, 10],     // lightDirection
    terrainTexelsIndex,
    terrainHeightmapIndex,
    0,
    terrainFacesIndex,
    terrainPositionIndex,
    terrainGrid.indices.length
);

camera.setTarget(terrainAsset.position);
camera.setDistance(10);
camera.setHeight(-10);
camera.update();


renderer.addAsset(shaderIndex, terrainAsset);
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