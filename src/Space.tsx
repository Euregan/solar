import { forwardRef } from "react";
import { ShaderMaterial, Vector3 } from "three";
import vertexShader from "./space.vert.glsl";
import fragmentShader from "./space.frag.glsl";

type SpaceProps = {
  sunSize: number;
  planets: Array<{
    position: Vector3;
    size: number;
  }>;
};

const Space = forwardRef<ShaderMaterial, SpaceProps>(
  ({ sunSize, planets }, ref) => (
    <mesh rotation={[Math.PI * 1.5, 0, 0]} receiveShadow>
      <planeGeometry args={[1500, 1500]} />
      <shaderMaterial
        ref={ref}
        args={[{ vertexShader, fragmentShader }]}
        uniforms={{
          planeSize: { value: 500 },
          sunSize: { value: sunSize },
          sunRange: { value: 250 },
          planetPositions: {
            value: planets.map(({ position }) => position),
          },
          planetSizes: { value: planets.map(({ size }) => size) },
        }}
      />
    </mesh>
  )
);

export default Space;
