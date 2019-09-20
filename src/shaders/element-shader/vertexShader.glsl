attribute vec4 aVertexPosition;
attribute vec2 aTexelCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTexelCoord;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelViewMatrix * aVertexPosition;
    vTexelCoord = aTexelCoord;
}