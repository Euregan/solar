import vertexShader from "./space.vert.glsl";
import fragmentShader from "./space.frag.glsl";

type SpaceProps = {
  sunSize: number;
};

const Space = ({ sunSize }: SpaceProps) => (
  <mesh rotation={[Math.PI * 1.5, 0, 0]}>
    <planeGeometry args={[500, 500]} />
    <shaderMaterial
      args={[{ vertexShader, fragmentShader }]}
      uniforms={{
        planeSize: { value: 500 },
        sunSize: { value: sunSize },
        sunRange: { value: 250 },
      }}
    />
  </mesh>
);

export default Space;
