precision mediump float;

#define darkestColor vec3(0.0313, 0.0313, 0.0392)
#define midColor vec3(0.1333, 0.1529, 0.1686)
#define sunColor vec3(0.2823, 0.2666, 0.1960)
#define planetCount 8
#define starScale 900.0
#define starsTreshold 9.5
#define starsExposure 200.0

#define PI 3.1415926535897932384626433832795

in vec4 worldPosition;
uniform float planeSize;
uniform float sunSize;
uniform float sunRange;

uniform vec3[planetCount] planetPositions;
uniform float[planetCount] planetSizes;

float random(vec2 point) {
    return fract(sin(dot(point.xy, vec2(12.998, 78.2233) * 2.0)) * 4375812.0);
}

vec3 hash(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));

    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(in vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    vec3 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(mix(dot(hash(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0)), dot(hash(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)), u.x), mix(dot(hash(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)), dot(hash(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)), u.x), u.y), mix(mix(dot(hash(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)), dot(hash(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)), u.x), mix(dot(hash(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)), dot(hash(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)), u.x), u.y), u.z);
}

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
    float closeRatio = smoothstep(sunSize / planeSize, (sunRange / 3.0) / planeSize, distance(worldPosition.xz, vec2(0.5)) / planeSize);
    float farRatio = smoothstep((sunRange / 3.0) / planeSize, sunRange / planeSize, distance(worldPosition.xz, vec2(0.5)) / planeSize);

    vec3 baseColor = mix(sunColor, midColor, vec3(closeRatio));
    baseColor = mix(baseColor, darkestColor, vec3(farRatio));

    // Handling the planets shadows
    for (int i = 0; i < planetCount; i++) {
        vec3 planetPosition = planetPositions[i];
        float planetSize = planetSizes[i];

        float angle = atan(planetPosition.z / planetPosition.x);

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

        bool isWithinShadowRectangle = isWithinTriangle(worldPosition.xz, bottomLeft, topLeft, topRight) || isWithinTriangle(worldPosition.xz, bottomLeft, topRight, bottomRight);
        bool isWithinShadowCircle = isWithinCircle(worldPosition.xz, endPoint, planetSize / 2.0);

        if (isWithinShadowRectangle || isWithinShadowCircle) {
            baseColor = darkestColor;
        }
    }

    float grain = random(worldPosition.xz) * 0.025;

    vec3 starsDirection = normalize(vec3((worldPosition.xz / planeSize) * 2.0 - 1.0, 1.0));
    float stars = pow(clamp(noise(starsDirection * starScale), 0.0, 1.0), starsTreshold) * starsExposure;

    gl_FragColor = vec4(max(baseColor - grain, stars), 1.0);
}
