import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Box,
  useTexture,
  Sphere,
  Html,
} from "@react-three/drei";
import { Suspense, Fragment, useEffect } from "react";
import * as THREE from "three";
import useStore from "./store";
import { useRef } from "react";
import { useControls } from "leva";
import colors from "./utils/colors";

function Control() {
  const setAngle = useStore((state) => state.setAngle);
  const controlEnabled = useStore((state) => state.controlEnabled);

  const controls = useRef();
  const others = useStore((state) => state.liveblocks.others);

  const sync = useStore((state) => state.sync);
  const { lock } = useControls({
    lock: false,
  });

  useFrame(() => {
    if (!!sync) {
      const target = others.find(({ connectionId }) => connectionId === sync);
      //console.log(presence);
      if (target && target.presence) {
        controls.current.setAzimuthalAngle(target.presence.angle.azimuth);
        controls.current.setPolarAngle(target.presence.angle.polaris);
      }
    }
  });

  return (
    <OrbitControls
      ref={controls}
      reverseOrbit
      enableZoom={false}
      onChange={({ target }) => {
        const azimuth = target.getAzimuthalAngle();
        const polaris = target.getPolarAngle();
        setAngle({ azimuth, polaris });
      }}
      enabled={!lock}
      makeDefault
      enablePan={false}
      rotateSpeed={0.2}
    />
  );
}

const {
  sin,
  cos,
  tan,
  asin,
  acos,
  atan,
  atan2,
  PI,
  random,
  sqrt,
  floor,
  abs,
  max,
  min,
} = Math;

export function xyz2latlng(vector3) {
  vector3.normalize();
  var lng = -atan2(-vector3.z, -vector3.x) + PI; // / 2;
  if (lng > PI) lng -= PI * 2;

  var p = new THREE.Vector3(vector3.x, 0, vector3.z);
  p.normalize();
  var lat = acos(p.dot(vector3));
  if (vector3.y < 0) lat *= -1;
  //console.log(lat * 180 / PI);
  //return [(lat * 180) / PI, (lng * 180) / PI];
  return { azimuth: (lat * 180) / PI, polaris: (lng * 180) / PI };
}

export function latlng2xyz(lat, lng, radius) {
  const longitude = (-lng * PI) / 180;
  const latitude = (lat * PI) / 180;
  const y = radius * sin(latitude);
  const x = radius * cos(longitude) * cos(latitude);
  const z = radius * sin(longitude) * cos(latitude);
  return [x, y, z];
}

function Still() {
  const setCursor = useStore((state) => state.setCursor);
  const setControlEnabled = useStore((state) => state.setControlEnabled);
  //const addFov = useLiveStore((state) => state.addFov);

  const tex = useTexture("/still2.jpg");

  useEffect(() => {}, []);

  const timer = useRef();

  const start = (e) => {
    timer.current = setTimeout(() => {
      console.log("looong", e);
      setControlEnabled(false);
    }, 300);
  };

  const cancel = () => {
    clearTimeout(timer.current);
  };
  return (
    <Sphere
      args={[500, 60, 40]}
      scale={[-1, 1, 1]}
      rotation-y={-Math.PI / 2}
      onPointerMove={(e) => {
        setCursor(xyz2latlng(e.point));
        cancel();
      }}
      onPointerDown={start}
      onPointerUp={() => {
        cancel();
        setControlEnabled(true);
      }}

      //onWheel={(e) => addFov(e.wheelDelta * -0.01)} //e.wheelDelta
    >
      <meshBasicMaterial toneMapped={false} side={THREE.BackSide} map={tex} />
    </Sphere>
  );
}

/*
function Cursor({ cursor }) {
  const { camera } = useThree();
  const pos = latlng2xyz(cursor.azimuth, cursor.polaris, 400);

  const projection = new THREE.Vector3(pos[0], pos[1], pos[2]).project(camera);
  const dot = camera.position
    .clone()
    .normalize()
    .dot(new THREE.Vector3(pos[0], pos[1], pos[2]).normalize());

  return (
    <Sphere args={[10]} position={pos}>
      <meshBasicMaterial color="red" />
    </Sphere>
  );
}

function Cursors() {
  const others = useStore((state) => state.liveblocks.others);

  return others.map(({ presence, connectionId, name }) => {
    if (!presence) return;
    return <Cursor key={connectionId} {...presence} />;
  });
}
*/

/*

*/

function UI() {
  const others = useStore((state) => state.liveblocks.others);
  const { camera } = useThree();

  return (
    <Html
      fullscreen
      style={{
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
      zIndexRange={[1, 0]}
    >
      {others.map(({ presence, connectionId, name }) => {
        if (!presence) return;
        const pos = latlng2xyz(
          presence.cursor.azimuth,
          presence.cursor.polaris,
          400
        );

        const projection = new THREE.Vector3(pos[0], pos[1], pos[2]).project(
          camera
        );
        const dot = camera.position
          .clone()
          .normalize()
          .dot(new THREE.Vector3(pos[0], pos[1], pos[2]).normalize());

        const area =
          abs(projection.x) < abs(projection.y)
            ? projection.y > 0
              ? "top"
              : "bottom"
            : projection.x > 0
            ? "right"
            : "left";

        let extended, x, y;
        switch (area) {
          case "top":
            y = 1;
            x = (projection.x / projection.y) * y;
            extended = { x, y };
            break;
          case "bottom":
            y = -1;
            x = (projection.x / projection.y) * y;
            extended = { x, y };
            break;
          case "left":
            x = -1;
            y = (projection.y / projection.x) * x;
            extended = { x, y };
            break;
          case "right":
            x = 1;
            y = (projection.y / projection.x) * x;
            extended = { x, y };
            break;
          default:
            break;
        }

        //console.log(extended);

        const color = colors[connectionId % colors.length];

        return (
          <Fragment key={connectionId}>
            <div
              style={{
                width: 10,
                height: 10,
                background: color,
                position: "absolute",
                top: `${-projection.y * 50 + 50}%`,
                left: `${projection.x * 50 + 50}%`,
              }}
            />
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 999,
                background: color,
                position: "absolute",
                transform: "translate3d(-50%, -50%, 0)",
                top: `${-extended.y * 50 + 50}%`,
                left: `${extended.x * 50 + 50}%`,
              }}
            />
          </Fragment>
        );
      })}
    </Html>
  );
}

export default function Scene() {
  return (
    <Canvas>
      <Suspense>
        <Still />
      </Suspense>
      <Control />
      {/* <Cursors /> */}
      <UI />
    </Canvas>
  );
}
