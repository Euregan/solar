type PlanetProps = {
  position: [number, number, number];
  size: number;
};

const Planet = ({ position, size }: PlanetProps) => (
  <group position={position}>
    <mesh castShadow>
      <sphereGeometry args={[size / 2]} />
      <meshStandardMaterial />
    </mesh>
  </group>
);

export default Planet;
