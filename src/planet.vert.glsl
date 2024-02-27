out vec3 vertexNormal;
out vec4 worldPosition;

void main() {
    vertexNormal = normal;
    worldPosition = (modelMatrix * vec4(position, 1.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
