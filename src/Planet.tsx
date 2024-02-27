import { forwardRef } from "react";
import { Group, Vector3 } from "three";
import vertexShader from "./planet.vert.glsl";
import fragmentShader from "./planet.frag.glsl";

type PlanetProps = {
  position: Vector3;
  size: number;
};

const Planet = forwardRef<Group, PlanetProps>(({ position, size }, ref) => (
  <group ref={ref} position={position}>
    <mesh castShadow>
      <sphereGeometry args={[size / 2]} />
      <shaderMaterial args={[{ vertexShader, fragmentShader }]} />
    </mesh>
  </group>
));

export default Planet;
