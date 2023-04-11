import {
  Box,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
  useTexture,
  useHelper,
  Html,
  //Wireframe,
  Edges,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Suspense } from "react";
import * as THREE from "three";
import {
  Geometry,
  Base,
  Addition,
  Subtraction,
  Intersection,
  Difference,
} from "@react-three/csg";

function Scene() {
  const tex = useTexture("/still3.jpg");

  return (
    <Sphere args={[10]}>
      <meshBasicMaterial side={THREE.BackSide} map={tex} />
    </Sphere>
  );
}

function Ghost() {
  const ref = useRef();
  useHelper(ref, THREE.CameraHelper);
  return (
    <Sphere args={[0.1]} position={[0, 0, -2]}>
      <PerspectiveCamera ref={ref} />
      <Html>
        <div>hekke</div>
      </Html>
    </Sphere>
  );
}

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <mesh>
          <meshNormalMaterial />
          <Geometry>
            <Base>
              <boxGeometry />
            </Base>
            <Subtraction position={[0.5, 0, 0]}>
              <sphereGeometry args={[0.8, 32, 32]} />
              <meshBasicMaterial color="orange" />
              <Edges />
            </Subtraction>
          </Geometry>
        </mesh>

        <OrbitControls />
        {/* 
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <Ghost />
        <group rotation={[Math.PI / 6, Math.PI / 2, 0]} rotation-order="YXZ">
          <group position={[0, 0, -2]}>
            <Ghost />
          </group>
  </group> */}
      </Canvas>
    </div>
  );
}
