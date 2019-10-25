precision mediump float;

varying highp vec2 vTexelCoord;

uniform sampler2D uSampler;

void main() {
    highp vec4 texelColor = texture2D(uSampler, vTexelCoord);

    gl_FragColor = texelColor;
}