precision mediump float;

varying vec4 vertexWorldPosition;
uniform float planeSize;
uniform float sunSize;
uniform float sunRange;

#define darkestColor vec3(0.0313, 0.0313, 0.0392)
#define sunColor vec3(0.2823, 0.2666, 0.1960)

void main() {
    float distanceFromCenter = smoothstep(sunSize / planeSize, sunRange / planeSize, distance(vertexWorldPosition.xz, vec2(0.5)) / planeSize);

    vec3 color = mix(sunColor, darkestColor, vec3(distanceFromCenter));

    gl_FragColor = vec4(color, 1.0);
}
