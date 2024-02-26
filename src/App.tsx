import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Space from "./Space";
import Sun from "./Sun";
import { useControls } from "leva";
import { NoToneMapping } from "three";

const App = () => {
  const { sunSize } = useControls({
    sunSize: 10,
  });

  return (
    <Canvas gl={{ toneMapping: NoToneMapping }}>
      <OrbitControls />

      <ambientLight intensity={Math.PI / 2} />
      <pointLight position={[0, sunSize, 0]} decay={0} intensity={Math.PI} />

      <Space sunSize={sunSize} />

      <Sun position={[0, sunSize, 0]} size={sunSize} />
    </Canvas>
  );
};

export default App;
