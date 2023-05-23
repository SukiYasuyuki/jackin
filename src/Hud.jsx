import { Hud, OrthographicCamera, Sphere } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export default function App({ children, matrix = new THREE.Matrix4() }) {
  const { camera, size } = useThree();
  const mesh = useRef(null);

  useFrame(() => {
    // Spin mesh to the inverse of the default cameras matrix
    matrix.copy(camera.matrix).invert();
    mesh.current.quaternion.setFromRotationMatrix(matrix);
  });

  return (
    <Hud>
      <OrthographicCamera position={[0, 0, 1000]} makeDefault />
      <group
        ref={mesh}
        //position={[size.width / 2 - 240, -size.height / 2 + 240, 0]}
        position={[0, -size.height / 2 + 200, 0]}
        scale={6} //4
      >
        {children}
        {/* <Sphere>
          <meshBasicMaterial color={"red"} />
  </Sphere> */}
      </group>
    </Hud>
  );
}
