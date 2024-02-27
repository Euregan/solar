import { Canvas } from "@react-three/fiber";
import { NoToneMapping } from "three";
import SolarSystem from "./SolarSystem";

const App = () => (
  <Canvas
    gl={{ toneMapping: NoToneMapping }}
    camera={{ position: [-25, 25, -50] }}
  >
    <SolarSystem />
  </Canvas>
);

export default App;
