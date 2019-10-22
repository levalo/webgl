precision mediump float;

varying highp vec2 vTexelCoord;
varying vec3 vNormal;

uniform sampler2D uSampler;
uniform vec3 uReverseLightDirection;

void main() {
    // because v_normal is a varying it's interpolated
    // so it will not be a unit vector. Normalizing it
    // will make it a unit vector again
    vec3 normal = normalize(vNormal);
 
    float light = dot(normal, uReverseLightDirection);

    highp vec4 texelColor = texture2D(uSampler, vTexelCoord);
    
    gl_FragColor = vec4(texelColor.rgb * light, texelColor.a);
}