type SunProps = {
  position: [number, number, number];
  size: number;
};

const Sun = ({ position, size }: SunProps) => (
  <group position={position}>
    <pointLight decay={0} intensity={3} color={0xfef37d} />

    <mesh>
      <sphereGeometry args={[size / 2]} />
      <meshBasicMaterial color={0xfef37d} />
    </mesh>
  </group>
);

export default Sun;
