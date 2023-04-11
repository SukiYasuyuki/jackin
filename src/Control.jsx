import {
  CameraControls,
  Box,
  PerspectiveCamera,
  Grid,
  useTexture,
  Sphere,
  Decal,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { buttonGroup, useControls } from "leva";
import { useRef } from "react";
import useKeyPress from "./hooks/useKeyPress";
import { useState } from "react";
import { useEffect } from "react";
import { Suspense } from "react";
import * as THREE from "three";

function Controls() {
  const ref = useRef();
  const [back, set] = useState(false);
  useControls({
    dolly: buttonGroup({
      opts: {
        1: () => ref.current?.dolly(10, true),
        "-1": () => ref.current?.dolly(-10, true),
      },
    }),
  });
  useKeyPress(" ", () => {
    //console.log("space");
    set((b) => !b);
  });

  /*
  useEffect(() => {
    ref.current?.dolly(back ? -10 : 10, true);
  }, [back]);
  */
  return (
    <CameraControls
      makeDefault
      onChange={(e) => {
        console.log(e.target.azimuthAngle, e.target.polarAngle);
      }}
      ref={ref}
      //onUpdate={(e) => console.log(e)}
      //smoothTime={0.1}
      /*
      azimuthRotateSpeed={-0.2}
      polarRotateSpeed={-0.2}
      mouseButtons-wheel={0}
      mouseButtons-right={0}
      mouseButtons-middle={0}
      mouseButtons-shiftLeft={0}
      */
    />
  );
}

function Still() {
  const tex = useTexture("/still4.jpg");
  return (
    <Sphere
      args={[500, 60, 40]}
      scale={[-1, 1, 1]}
      rotation-y={-Math.PI / 2}
      /*
      onPointerDown={start}
      onPointerUp={() => {
        cancel();
        //setControlEnabled(true);
      }}
      */
      //onWheel={(e) => addFov(e.wheelDelta * -0.01)}
    >
      <meshBasicMaterial toneMapped={false} side={THREE.BackSide} map={tex} />
    </Sphere>
  );
}

function Face() {
  const tex = useTexture("/face.png");
  return (
    <Sphere args={[2]}>
      <meshBasicMaterial />

      <Decal
        debug
        position={[0, 0, -2]}
        rotation={[-0.01, 0, 0]}
        scale={[1.5, 1.5, 1]}
      >
        <meshBasicMaterial
          map={tex}
          polygonOffset
          polygonOffsetFactor={-10}
          transparent
        />
      </Decal>
    </Sphere>
  );
}

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <Suspense fallback={null}>
          <Face />
        </Suspense>
        <Controls />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <Grid args={[10.5, 10.5]} />
        <Suspense fallback={null}>
          <Still />
        </Suspense>
      </Canvas>
    </div>
  );
}
