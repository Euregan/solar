precision mediump float;

#define ivory vec3(0.8549, 0.8117, 0.7450)
#define shadow vec3(0.0313, 0.0313, 0.0392)

in vec3 vertexNormal;
in vec4 worldPosition;

void main() {
    float exposure = dot(vertexNormal, normalize(-worldPosition.xyz));

    gl_FragColor = vec4(mix(shadow, ivory, exposure), 1.0);
}
