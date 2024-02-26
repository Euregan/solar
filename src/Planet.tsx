type PlanetProps = {
  position: [number, number, number];
  size: number;
};

const Planet = ({ position, size }: PlanetProps) => (
  <mesh position={position}>
    <sphereGeometry args={[size / 2]} />
    <meshStandardMaterial />
  </mesh>
);

export default Planet;
