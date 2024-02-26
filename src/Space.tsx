import vertexShader from "./space.vert.glsl";
import fragmentShader from "./space.frag.glsl";
import { Vector3 } from "three";

type SpaceProps = {
  sunSize: number;
  planets: Array<{
    position: [number, number, number];
    size: number;
  }>;
};

const Space = ({ sunSize, planets }: SpaceProps) => (
  <mesh rotation={[Math.PI * 1.5, 0, 0]} receiveShadow>
    <planeGeometry args={[500, 500]} />
    <shaderMaterial
      args={[{ vertexShader, fragmentShader }]}
      uniforms={{
        planeSize: { value: 500 },
        sunSize: { value: sunSize },
        sunRange: { value: 250 },
        planetPositions: {
          value: planets.map(({ position }) => new Vector3(...position)),
        },
        planetSizes: { value: planets.map(({ size }) => size) },
      }}
    />
  </mesh>
);

export default Space;
