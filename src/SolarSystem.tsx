import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import Space from "./Space";
import Sun from "./Sun";
import Planet from "./Planet";
import { Group, ShaderMaterial, Vector3 } from "three";
import { useRef } from "react";
import { SpecialInputs } from "leva/dist/declarations/src/types";

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
const fastestPlanet = planets.reduce(
  (maxSpeed, { speed }) => Math.max(maxSpeed, speed),
  0
);

const orbitAxis = new Vector3(0, 1, 0);

const SolarSystem = () => {
  const {
    sunSize,
    planetMinimumDistance,
    planetMaximumDistance,
    scale,
    speed,
  } = useControls({
    sunSize: 10,
    planetMinimumDistance: 25,
    planetMaximumDistance: 250,
    scale: 10,
    speed: 0.001,
    play: {
      label: "Toggle animation",
      type: "BUTTON" as SpecialInputs.BUTTON,
      onClick: () => (play.current = !play.current),
      settings: {},
    },
  });

  const distanceMultiplier =
    (planetMaximumDistance - planetMinimumDistance) / furthestPlanetDistance;
  const sizeMultiplier = scale / largestPlanetSize;
  const speedMultiplier = speed / fastestPlanet;

  const positionedPlanets = planets.map((planet) => ({
    position: new Vector3(
      planet.distance * distanceMultiplier + planetMinimumDistance,
      0,
      0
    ).applyAxisAngle(orbitAxis, Math.PI * planet.speed),
    size: sizeMultiplier * planet.size,
    speed: planet.speed,
  }));

  const spaceMaterialRef = useRef<ShaderMaterial>(null);
  const planetsRef = useRef<Array<Group>>([]);
  const play = useRef(true);

  useFrame(() => {
    if (play.current) {
      const updatedPlanetPositions = positionedPlanets.map((planet, index) => {
        // This updates the vector, so there is no particular need to store the result anywhere
        planet.position.applyAxisAngle(
          orbitAxis,
          speedMultiplier * planet.speed
        );

        planetsRef.current[index].position.copy(planet.position);

        return planet.position;
      });

      if (spaceMaterialRef.current) {
        spaceMaterialRef.current.uniforms.planetPositions = {
          value: updatedPlanetPositions,
        };
      }
    }
  });

  return (
    <>
      <color attach="background" args={[0x08080a]} />

      <OrbitControls />

      <ambientLight intensity={1} color={0x242628} />

      <Space
        ref={spaceMaterialRef}
        sunSize={sunSize}
        planets={positionedPlanets}
      />

      <Sun position={[0, 0, 0]} size={sunSize} />

      {positionedPlanets.map(({ position, size }, index) => (
        <Planet
          key={index}
          ref={(planet) => (planetsRef.current[index] = planet!)}
          position={position}
          size={size}
        />
      ))}
    </>
  );
};

export default SolarSystem;
