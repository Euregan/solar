precision mediump float;

#define darkestColor vec3(0.0313, 0.0313, 0.0392)
#define sunColor vec3(0.2823, 0.2666, 0.1960)
#define planetCount 8

in vec4 vertexWorldPosition;
uniform float planeSize;
uniform float sunSize;
uniform float sunRange;

uniform vec3[planetCount] planetPositions;
uniform float[planetCount] planetSizes;

bool isWithinCircle(vec2 point, vec2 origin, float radius) {
    return distance(point, origin) < radius;
}

void main() {
    float distanceFromCenter = smoothstep(sunSize / planeSize, sunRange / planeSize, distance(vertexWorldPosition.xz, vec2(0.5)) / planeSize);

    vec3 baseColor = mix(sunColor, darkestColor, vec3(distanceFromCenter));

    // Handling the planets shadows
    for (int i = 0; i < planetCount; i++) {
        vec3 planetPosition = planetPositions[i];
        float planetSize = planetSizes[i];

        // We nest the ifs to optimize computation

        bool behindPlanet = vertexWorldPosition.x > planetPosition.x;
        if (behindPlanet) {
            bool withinPlanetWidth = vertexWorldPosition.z > planetPosition.z - planetSize / 2.0 && vertexWorldPosition.z < planetPosition.z + planetSize / 2.0;
            if (withinPlanetWidth) {
                float shadowRange = 1.2 * planetSize;

                bool withinShadowRange = vertexWorldPosition.x < planetPosition.x + shadowRange
                    // The planet curvature
                || isWithinCircle(vertexWorldPosition.xz, vec2(planetPosition.x + shadowRange, planetPosition.z), planetSize / 2.0);

                if (withinShadowRange) {
                    baseColor = darkestColor;
                }
            }
        }
    }

    gl_FragColor = vec4(baseColor, 1.0);
}
