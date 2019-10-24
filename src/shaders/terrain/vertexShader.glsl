attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec4 vTexelCoord;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelViewMatrix * aVertexPosition;
    vTexelCoord = aVertexPosition;
}