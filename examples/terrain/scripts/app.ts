import { Renderer, createGrid, Geometry, TerrainShader, degreeToRadian } from '../../../src';
import * as heightmap from '../res/heightmap.png';

const canvas    = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width    = document.documentElement.clientWidth;
canvas.height   = document.documentElement.clientHeight - 3;

const renderer              = new Renderer(canvas);
const terrainShader         = new TerrainShader(renderer);
const shaderIndex           = renderer.registrShader(terrainShader);
const camera                = renderer.getCamera();
const terrainGrid           = createGrid(255);
const terrainHeightmapIndex = renderer.createTexture(heightmap);
const terrainPositionIndex  = renderer.createArrayBuffer(terrainGrid.vertices);
const terrainTexelsIndex    = renderer.createArrayBuffer(terrainGrid.texels);
const terrainFacesIndex     = renderer.createElementsBuffer(terrainGrid.indices);
const player                = [ 0, 5, -5 ];

const terrainAsset = new Geometry(
    [0, 0, 0],      // translate
    [0, 180, 0],    // rotate
    [5, 5, 5],   // scale
    [0, 4, 10],     // lightDirection
    terrainTexelsIndex,
    terrainHeightmapIndex,
    0,
    terrainFacesIndex,
    terrainPositionIndex,
    terrainGrid.indices.length
);

camera.setTarget(player);
camera.setDistance(1);
camera.setHeight(0);
camera.update();


renderer.addAsset(shaderIndex, terrainAsset);
renderer.setBackgroundColor(new Float32Array([0.9, 0.9, 0.9]));

let cameraAngleX = 45;
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

document.onkeydown = (event: KeyboardEvent): void => {
    if (event.keyCode == 38) {
        player[0] += Math.sin(degreeToRadian(cameraAngleY)) * 0.2;
        player[2] += Math.cos(degreeToRadian(cameraAngleY)) * 0.2;
        player[1] += -1 * Math.sin(degreeToRadian(cameraAngleX)) * 0.2;
    }

    camera.update();
}

const renderLoop = (): void => {
    renderer.render();

    requestAnimationFrame(renderLoop)
};

requestAnimationFrame(renderLoop);