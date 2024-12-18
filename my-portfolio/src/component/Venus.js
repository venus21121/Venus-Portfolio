import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
const Venus = () => {
  return (
    <Canvas style={{ height: "400px" }}>
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 2]} />
      <Sphere visible args={[1, 100, 200]} scale={2.5}>
        <MeshDistortMaterial
          color="#f542c3"
          attach="material"
          distort={0.3}
          speed={1.5}
        />
      </Sphere>
    </Canvas>
  );
};

export default Venus;
