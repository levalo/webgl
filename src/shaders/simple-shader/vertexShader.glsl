attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
}