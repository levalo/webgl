varying highp vec2 vTexelCoord;

uniform sampler2D uSampler;

void main() {
    gl_FragColor = texture2D(uSampler, vTexelCoord);
}