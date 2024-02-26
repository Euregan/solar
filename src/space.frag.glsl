precision mediump float;

#define darkestColor vec3(0.0313, 0.0313, 0.0392)
#define sunColor vec3(0.2823, 0.2666, 0.1960)
#define planetCount 8
#define PI 3.1415926535897932384626433832795

in vec4 vertexWorldPosition;
uniform float planeSize;
uniform float sunSize;
uniform float sunRange;

uniform vec3[planetCount] planetPositions;
uniform float[planetCount] planetSizes;

bool isWithinCircle(vec2 point, vec2 origin, float radius) {
    return distance(point, origin) < radius;
}

float segmentSign(vec2 point1, vec2 point2, vec2 point3) {
    return (point1.x - point3.x) * (point2.y - point3.y) - (point2.x - point3.x) * (point1.y - point3.y);
}

bool isWithinTriangle(vec2 point, vec2 point1, vec2 point2, vec2 point3) {
    float segment1Sign, segment2Sign, segment3Sign;
    bool isNegative, isPositive;

    segment1Sign = segmentSign(point, point1, point2);
    segment2Sign = segmentSign(point, point2, point3);
    segment3Sign = segmentSign(point, point3, point1);

    isNegative = (segment1Sign < 0.0) || (segment2Sign < 0.0) || (segment3Sign < 0.0);
    isPositive = (segment1Sign > 0.0) || (segment2Sign > 0.0) || (segment3Sign > 0.0);

    return !(isNegative && isPositive);
}

void main() {
    float distanceFromCenter = smoothstep(sunSize / planeSize, sunRange / planeSize, distance(vertexWorldPosition.xz, vec2(0.5)) / planeSize);

    vec3 baseColor = mix(sunColor, darkestColor, vec3(distanceFromCenter));

    // Handling the planets shadows
    for (int i = 0; i < planetCount; i++) {
        vec3 planetPosition = planetPositions[i];
        float planetSize = planetSizes[i];

        float angle = atan(planetPosition.z / planetPosition.x);

        bool behindPlanet = length(vertexWorldPosition.xz) > length(planetPosition.xz);

        float shadowLength = 1.2 * planetSize;
        float shadowWidth = planetSize;

        vec2 lengthOffset = planetPosition.xz * (shadowLength / length(planetPosition.xz));
        vec2 widthOffset = vec2(cos(angle + PI * 0.5) * (shadowWidth / 2.0), sin(angle + PI * 0.5) * (shadowWidth / 2.0));

        // When looking at the end of the shadow from the planet
        vec2 bottomLeft = planetPosition.xz + widthOffset;
        vec2 topLeft = bottomLeft + lengthOffset;
        vec2 topRight = topLeft - widthOffset * 2.0;
        vec2 bottomRight = topRight - lengthOffset;

        vec2 endPoint = planetPosition.xz + lengthOffset;

        bool isWithinShadowRectangle = isWithinTriangle(vertexWorldPosition.xz, bottomLeft, topLeft, topRight) || isWithinTriangle(vertexWorldPosition.xz, bottomLeft, topRight, bottomRight);
        bool isWithinShadowCircle = isWithinCircle(vertexWorldPosition.xz, endPoint, planetSize / 2.0);

        if (isWithinShadowRectangle || isWithinShadowCircle) {
            baseColor = darkestColor;
        }
    }

    gl_FragColor = vec4(baseColor, 1.0);
}
