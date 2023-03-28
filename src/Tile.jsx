import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Box, OrbitControls, Plane } from "@react-three/drei";
import { useRef } from "react";
import { useState } from "react";

function Tile({ children }) {
  //const { camera } = useThree();
  const ref = useRef();
  const [close, setClose] = useState(false);

  useFrame(({ camera }) => {
    //console.log(camera.position, ref.current.position);
    const dist = camera.position.clone().distanceTo(ref.current.position);
    setClose(dist < 2);
  });

  console.log(close);

  return (
    <>
      <Plane ref={ref} visible={!close}>
        <meshBasicMaterial color={"blue"} />
      </Plane>

      {close && <>{children}</>}
    </>
  );
}

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <OrbitControls />
        <Tile>
          <Plane args={[0.5, 0.5]} position={[0.25, 0.25, -0.001]}>
            <meshBasicMaterial color={"red"} />
          </Plane>
          <Plane args={[0.5, 0.5]} position={[0.25, -0.25, 0.001]}>
            <meshBasicMaterial color={"red"} />
          </Plane>
          <Plane args={[0.5, 0.5]} position={[-0.25, 0.25, 0.001]}>
            <meshBasicMaterial color={"red"} />
          </Plane>
          <Plane args={[0.5, 0.5]} position={[-0.25, -0.25, 0.001]}>
            <meshBasicMaterial color={"red"} />
          </Plane>
        </Tile>
      </Canvas>
    </div>
  );
}
