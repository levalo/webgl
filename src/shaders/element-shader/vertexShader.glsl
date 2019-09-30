attribute vec4 aVertexPosition;
attribute vec2 aTexelCoord;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTexelCoord;
varying vec3 vNormal;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelViewMatrix * aVertexPosition;
    vTexelCoord = aTexelCoord;
    vNormal = aNormal;
}