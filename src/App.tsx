import { Canvas } from "@react-three/fiber";
import { NoToneMapping } from "three";
import SolarSystem from "./SolarSystem";
import { Leva } from "leva";

const App = () => (
  <>
    <Canvas
      gl={{ toneMapping: NoToneMapping }}
      camera={{ position: [-25, 25, -50] }}
    >
      <SolarSystem />
    </Canvas>
    {/* @ts-expect-error TS seems to believe process cannot exist outside of node */}
    <Leva hidden={process.env.NODE_ENV === "production"} />
  </>
);

export default App;
