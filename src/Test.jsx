import {
  OrbitControls,
  Sphere,
  Box,
  Plane,
  Hud,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";
import * as THREE from "three";

function Viewcube({ renderPriority = 1, matrix = new THREE.Matrix4() }) {
  const mesh = useRef(null);
  const { camera, size } = useThree();
  const [hovered, hover] = useState(null);

  useFrame(() => {
    // Spin mesh to the inverse of the default cameras matrix
    matrix.copy(camera.matrix).invert();
    //mesh.current.quaternion.setFromRotationMatrix(matrix)
  });

  return (
    <Hud renderPriority={renderPriority}>
      <OrthographicCamera makeDefault position={[0, 0, 100]} />
      <mesh
        ref={mesh}
        position={[size.width / 2 - 120, -size.height / 2, 0]}
        onPointerOut={(e) => hover(null)}
        onPointerMove={(e) => hover(e.face.materialIndex)}
      >
        {[...Array(6)].map((_, index) => (
          <meshLambertMaterial
            attach={`material-${index}`}
            key={index}
            color={hovered === index ? "orange" : "hotpink"}
          />
        ))}
        <boxGeometry args={[80, 80, 80]} />
      </mesh>
      <ambientLight intensity={1} />
      <pointLight position={[200, 200, 100]} intensity={0.5} />
    </Hud>
  );
}

function Portal() {
  const { camera, size } = useThree();

  const viewport = useThree((state) => state.viewport);

  console.log(viewport);
  return (
    <Hud>
      {/* <OrthographicCamera makeDefault zoom={1} position={[0, 0, 600]} /> */}
      <PerspectiveCamera makeDefault position={[0, 0, 600]} />
      <group position={[0, 0, 0]} scale={1}>
        <Plane args={[4, 1]} rotation-x={Math.PI * 0.5}>
          <meshBasicMaterial color={"blue"} side={THREE.DoubleSide} />
        </Plane>
      </group>
    </Hud>
  );
}

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <OrbitControls />
        <Portal />
        <group position={[0, 0, 0]} scale={2}>
          <Plane args={[4, 1]} rotation-x={Math.PI * 0.5}>
            <meshBasicMaterial color={"red"} />
          </Plane>
        </group>
      </Canvas>
    </div>
  );
}
