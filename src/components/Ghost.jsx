import {
  Sphere,
  Box,
  RoundedBox,
  Html,
  PerspectiveCamera,
  useHelper,
  Decal,
  useTexture,
  Edges,
  Line,
  Cone,
} from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { styled } from "@stitches/react";
import useStore from "../store";
import { Comment } from "../Scene";
import { map } from "../utils/math";
import { Model as Head } from "../Head";

export const Label = styled("div", {
  color: "black",
  padding: "0px 4px",
  translate: "0 30px",
  fontSize: 12,
  borderRadius: 4,
  whiteSpace: "nowrap",
});

export default function Ghost({
  color = "yellow",
  name,
  fov,
  reaction,
  comment,
  mic,
}) {
  const ref = useRef();
  //useHelper(ref, THREE.CameraHelper);
  const texture = useTexture("/face.png");
  const inner = useStore((state) => state.inner);
  const size = useStore((state) => state.size);
  return (
    <group scale={2} position={[0, 0, -inner]}>
      {/* <RoundedBox
        args={[1, 1, 1]}
        radius={0.25}
        scale={1 + map(mic, 0.15, 1, 0, 1)}
      >
        <meshStandardMaterial color={color} toneMapped={false} />
        <Decal
          //debug // Makes "bounding box" of the decal visible
          position={[0, 0, -1]} // Position of the decal
          rotation={[0, 0, 0]} // Rotation of the decal (can be a vector or a degree in radians)
          scale={1.25} // Scale of the decal
        >
          <meshBasicMaterial map={texture} transparent />
        </Decal>
        <PerspectiveCamera ref={ref} fov={fov} />
        <Html center>
          <Label css={{ background: color }}>{name}</Label>
          {reaction && (
            <div
              style={{
                fontSize: 48,
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              {reaction.value}
            </div>
          )}
          {comment && <Comment area={"bottom"}>{comment[1].text}</Comment>}
        </Html>
            </RoundedBox> */}
      <Suspense fallback={null}>
        <Head color={color} scale={1 + map(mic, 0.15, 1, 0, 1)} />
        <Html center>
          <Label css={{ background: color }}>{name}</Label>
          {reaction && (
            <div
              style={{
                fontSize: 48,
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              {reaction.value}
            </div>
          )}
          {comment && <Comment area={"bottom"}>{comment[1].text}</Comment>}
        </Html>
      </Suspense>
      <Cone
        args={[10, 10, 4]}
        position={[0, 0, -6]}
        rotation-x={Math.PI / 2}
        rotation-y={Math.PI / 4}
        //rotation-order="zxy"
      >
        <meshBasicMaterial
          color={color}
          toneMapped={false}
          transparent
          opacity={0.1}
        />
        <Edges color={color} />
      </Cone>
    </group>
  );
}

/* <Line
          points={[
            [0, 0, -2],
            [0, 0, -5],
          ]}
          color={color}
          lineWidth={size}
        >
          <meshBasicMaterial color={color} toneMapped={false} />
        </Line>
        <Cone args={[0.3, 0.6]} position={[0, 0, -5]} rotation-x={-Math.PI / 2}>
          <meshBasicMaterial color={color} toneMapped={false} />
        </Cone> */
