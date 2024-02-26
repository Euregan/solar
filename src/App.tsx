import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Space from "./Space";
import Sun from "./Sun";
import { useControls } from "leva";
import { NoToneMapping } from "three";
import Planet from "./Planet";

const App = () => {
  const { sunSize, planetMinimumDistance, planetMaximumDistance, scale } =
    useControls({
      sunSize: 10,
      planetMinimumDistance: 25,
      planetMaximumDistance: 250,
      scale: 10,
    });

  // Everything is in km and km/s
  const planets = [
    // Mercury
    { size: 2439.7 * 2, distance: 57910000, speed: 47.36 },
    // Venus
    { size: 6051.8 * 2, distance: 108210000, speed: 35.02 },
    // Earth
    { size: 6371 * 2, distance: 149598023, speed: 29.7827 },
    // Mars
    { size: 3389.5 * 2, distance: 227939366, speed: 24.07 },
    // Jupiter
    { size: 69911 * 2, distance: 778479000, speed: 13.07 },
    // Saturn
    { size: 58232 * 2, distance: 1433530000, speed: 9.68 },
    // Uranus
    { size: 25362 * 2, distance: 2870972000, speed: 6.8 },
    // Neptune
    { size: 24622 * 2, distance: 4500000000, speed: 5.43 },
  ];

  const furthestPlanetDistance = planets.reduce(
    (maxDistance, { distance }) => Math.max(maxDistance, distance),
    0
  );
  const largestPlanetSize = planets.reduce(
    (maxSize, { size }) => Math.max(maxSize, size),
    0
  );

  const distanceMultiplier =
    (planetMaximumDistance - planetMinimumDistance) / furthestPlanetDistance;
  const sizeMultiplier = scale / largestPlanetSize;

  const scaledPlanets = planets.map((planet) => ({
    position: [
      planet.distance * distanceMultiplier + planetMinimumDistance,
      0,
      0,
    ] as [number, number, number],
    size: sizeMultiplier * planet.size,
  }));

  return (
    <Canvas gl={{ toneMapping: NoToneMapping }}>
      <color attach="background" args={[0x08080a]} />

      <OrbitControls />

      <ambientLight intensity={1} color={0x242628} />

      <Space sunSize={sunSize} planets={scaledPlanets} />

      <Sun position={[0, 0, 0]} size={sunSize} />

      {scaledPlanets.map(({ position, size }, index) => (
        <Planet key={index} position={position} size={size} />
      ))}
    </Canvas>
  );
};

export default App;
