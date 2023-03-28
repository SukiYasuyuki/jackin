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
import { styled } from "@stitches/react";
import Emoticon from "./components/Emoticon";
import { map } from "./utils/math";

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
      enabled={controlEnabled}
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

  const tex = useTexture("/still3.jpg");

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
        //cancel();
      }}
      /*
      onPointerDown={start}
      onPointerUp={() => {
        cancel();
        //setControlEnabled(true);
      }}
      */
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
  const edge = useStore((state) => state.edge);
  const comments = useStore((state) => state.comments);
  const reactions = useStore((state) => state.reactions);

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

        const p = {
          x: dot < 0 ? projection.x : -projection.x,
          y: dot < 0 ? projection.y : -projection.y,
        };

        const area =
          abs(p.x) < abs(p.y)
            ? p.y > 0
              ? "top"
              : "bottom"
            : p.x > 0
            ? "right"
            : "left";

        let extended, x, y;
        switch (area) {
          case "top":
            y = 1;
            x = (p.x / p.y) * y;
            extended = { x, y };
            break;
          case "bottom":
            y = -1;
            x = (p.x / p.y) * y;
            extended = { x, y };
            break;
          case "left":
            x = -1;
            y = (p.y / p.x) * x;
            extended = { x, y };
            break;
          case "right":
            x = 1;
            y = (p.y / p.x) * x;
            extended = { x, y };
            break;
          default:
            break;
        }

        //console.log(extended);

        const color = colors[connectionId % colors.length];

        const comment = Object.entries(comments).findLast(
          ([_, { to, from }]) => connectionId === from
        );
        const reaction = reactions.findLast((r) => r.id === connectionId);

        return (
          <Fragment key={connectionId}>
            <svg
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                top: `${-projection.y * 50 + 50}%`,
                left: `${projection.x * 50 + 50}%`,
                //transform: `translateX(${x}px) translateY(${y}px)`,
              }}
              width="24"
              height="36"
              viewBox="0 0 24 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                fill={color}
                stroke="white"
                style={{
                  filter: "drop-shadow(0px 0px 4px rgb(0 0 0 / 0.4))",
                }}
              />
            </svg>
            {edge && (
              <EdgeCircle
                style={{
                  color,

                  top: `${-extended.y * 50 + 50}%`,
                  left: `${extended.x * 50 + 50}%`,
                  outlineWidth: map(presence.mic, 0.15, 1, 4, 12),
                }}
                area={area}
              >
                <Emoticon {...presence.face} />
                <Label area={area} style={{ background: color }}>
                  {presence.name}
                </Label>
                {comment && <Comment area={area}>{comment[1].text}</Comment>}
                {reaction && (
                  <div
                    style={{
                      fontSize: 64,
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  >
                    {reaction.value}
                  </div>
                )}
              </EdgeCircle>
            )}
          </Fragment>
        );
      })}
    </Html>
  );
}

const EdgeCircle = styled("div", {
  width: 64,
  height: 64,
  borderRadius: 999,
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  outlineColor: "currentcolor",
  outlineStyle: "solid",
  outlineWidth: 4,
  outlineOffset: 4,
  //transform: "translate3d(-50%, -50%, 0)",
  variants: {
    area: {
      top: {
        translate: "-50% -10%",
      },
      bottom: {
        translate: "-50% -90%",
      },
      left: {
        translate: "-10% -50%",
      },
      right: {
        translate: "-90% -50%",
      },
    },
  },
});

const Comment = styled("div", {
  position: "absolute",
  color: "black",
  background: "white",
  borderRadius: "999px",
  whiteSpace: "nowrap",
  fontSize: 14,
  //height: "20px",
  lineHeight: "20px",
  top: "-40px",
  padding: "4px 12px",
  variants: {
    area: {
      top: {
        left: "auto",
        right: "auto",
        top: "auto",
        bottom: "-40px",
      },
      bottom: {
        left: "auto",
        right: "auto",
      },
      left: {
        left: "16px",
      },
      right: {
        right: "16px",
      },
    },
  },
});

const Label = styled("div", {
  position: "absolute",
  color: "black",
  borderRadius: "999px",
  fontSize: 12,
  height: "20px",
  lineHeight: "20px",
  bottom: "-12px",
  padding: "0 4px",
  variants: {
    area: {
      bottom: {
        bottom: "auto",
        top: "-12px",
      },
    },
  },
});

export default function Scene(props) {
  return (
    <Canvas {...props}>
      <Suspense>
        <Still />
      </Suspense>
      <Control />
      {/* <Cursors /> */}
      <UI />
    </Canvas>
  );
}
