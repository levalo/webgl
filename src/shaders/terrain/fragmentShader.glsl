precision mediump float;

varying highp vec4 vTexelCoord;

uniform sampler2D uSampler;

void main() {
    gl_FragColor = vTexelCoord;
    gl_FragColor = vec4(1,0,0,1);
}