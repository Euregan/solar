import { Canvas } from "@react-three/fiber";
import { NoToneMapping } from "three";
import SolarSystem from "./SolarSystem";
import { Leva } from "leva";
import { OrbitControls } from "@react-three/drei";

// @ts-expect-error TS seems to believe process cannot exist outside of node
const production = process.env.NODE_ENV === "production";

const App = () => (
  <>
    <Canvas
      gl={{ toneMapping: NoToneMapping }}
      camera={{ position: [-120, 120, -120], zoom: 5 }}
      orthographic
    >
      {!production && <OrbitControls />}

      <SolarSystem />
    </Canvas>
    <Leva hidden={production} />
  </>
);

export default App;
