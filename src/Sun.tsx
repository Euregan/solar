type SunProps = {
  position: [number, number, number];
  size: number;
};

const Sun = ({ position, size }: SunProps) => (
  <mesh position={position}>
    <sphereGeometry args={[size / 2]} />
    <meshBasicMaterial color={0xfef37d} />
  </mesh>
);

export default Sun;
