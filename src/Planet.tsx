import { forwardRef } from "react";
import { Group, Vector3 } from "three";

type PlanetProps = {
  position: Vector3;
  size: number;
};

const Planet = forwardRef<Group, PlanetProps>(({ position, size }, ref) => (
  <group ref={ref} position={position}>
    <mesh castShadow>
      <sphereGeometry args={[size / 2]} />
      <meshStandardMaterial />
    </mesh>
  </group>
));

export default Planet;
