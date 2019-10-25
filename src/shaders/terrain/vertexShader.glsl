attribute vec4 aVertexPosition;
attribute vec2 aTexelCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform sampler2D uSampler;

varying highp vec2 vTexelCoord;

void main() {
    vec4 realPosition = vec4(aVertexPosition[0], 0, aVertexPosition[1], 1);

    realPosition.y = texture2D(uSampler, aTexelCoord).r * 0.3;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelViewMatrix * realPosition;

    vTexelCoord = aTexelCoord;
}