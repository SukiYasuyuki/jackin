import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Box,
  Cone,
  RoundedBox,
  useTexture,
  Sphere,
  Icosahedron,
  Html,
  PerspectiveCamera,
  CameraControls,
  useHelper,
  Environment,
  Wireframe,
  Line,
  Edges,
  Circle,
} from "@react-three/drei";
import { Suspense, Fragment, useEffect, useState } from "react";
import * as THREE from "three";
import useStore from "./store";
import { useRef } from "react";
import { useControls } from "leva";
import colors from "./utils/colors";
import { styled } from "@stitches/react";
import Emoticon from "./components/Emoticon";
import { map } from "./utils/math";
import Attention from "./components/Attention";
import Rader from "./components/Rader";
import Ghost, { Label as Label2 } from "./components/Ghost";

import ProjectedMaterial from "./components/ProjectedMaterial";
import useKeyPress from "./hooks/useKeyPress";
import useMyId from "./hooks/useMyId";
import { Model as Head } from "./Head";
import Hud from "./Hud";
import Flags from "./Flags";
import Observatory from "./components/Observatory";
import { PieContainer, Item } from "./Pie";

function Control() {
  const setAngle = useStore((state) => state.setAngle);
  const controlEnabled = useStore((state) => state.controlEnabled);

  const controls = useRef();
  const others = useStore((state) => state.liveblocks.others);

  const sync = useStore((state) => state.sync);

  /*
  const { stepback } = useControls({
    stepback: { value: 100, min: 10, max: 500 },
  });
  */

  const stepback = useStore((state) => state.stepback);
  const toggleStepback = useStore((state) => state.toggleStepback);
  const displayType = useStore((state) => state.displayType);

  useKeyPress([" ", "b"], toggleStepback);
  useEffect(() => {
    controls.current?.dolly(stepback ? -100 : 100, true);
  }, [stepback]);

  /*
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
  */

  const setDragging = useStore((state) => state.setDragging);
  const pieMenuOpen = useStore((state) => state.pieMenuOpen);
  return (
    <CameraControls
      enabled={!pieMenuOpen}
      makeDefault
      onChange={({ target }) => {
        //console.log(e.target.azimuthAngle, e.target.polarAngle);
        setAngle({ azimuth: target.azimuthAngle, polaris: target.polarAngle });
      }}
      ref={controls}
      //onUpdate={(e) => console.log(e)}
      azimuthRotateSpeed={-0.2}
      polarRotateSpeed={-0.2}
      //smoothTime={0.1}
      mouseButtons-wheel={0}
      mouseButtons-right={0}
      mouseButtons-middle={0}
      mouseButtons-shiftLeft={0}
      onStart={() => setDragging(true)}
      onEnd={() => setDragging(false)}
    />
  );
}

/* <OrbitControls
      ref={controls}
      reverseOrbit
      enableZoom={false}
      onChange={({ target }) => {
        const azimuth = target.getAzimuthalAngle();
        const polaris = target.getPolarAngle();
        console.log(azimuth, polaris);
        setAngle({ azimuth, polaris });
      }}
      enabled={controlEnabled}
      makeDefault
      enablePan={false}
      rotateSpeed={0.2}
    /> */
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
  const addFov = useStore((state) => state.addFov);
  const setControlEnabled = useStore((state) => state.setControlEnabled);
  //const addFov = useLiveStore((state) => state.addFov);

  const tex = useTexture("/still4.jpg");

  useEffect(() => {}, []);

  const timer = useRef();

  /*
  const start = (e) => {
    timer.current = setTimeout(() => {
      console.log("looong", e);
      setControlEnabled(false);
    }, 300);
  };

  const cancel = () => {
    clearTimeout(timer.current);
  };
  */
  const mat = useRef();
  const displayType = useStore((state) => state.displayType);

  useFrame(({ scene }) => {
    if (displayType === "sphere") {
      const camera = scene.getObjectByName("cam");
      mat.current.viewMatrixCamera = camera.matrixWorldInverse.clone();
      mat.current.projectionMatrixCamera = camera.projectionMatrix.clone();
      mat.current.projPosition = camera.position.clone();
    }
  });

  const ref = useRef();
  useHelper(ref, THREE.CameraHelper);

  const { rot } = useControls({
    rot: { value: 0, min: 0, max: Math.PI * 2 },
  });

  const addFlag = useStore((state) => state.addFlag);
  const myId = useMyId();

  return (
    <>
      <group rotation-y={-Math.PI / 2}>
        <Sphere
          args={[500, 64, 64]}
          scale={[-1, 1, 1]}
          onPointerMove={(e) => {
            setCursor(xyz2latlng(e.point));
            //cancel();
          }}
          onDoubleClick={(e) => {
            addFlag(xyz2latlng(e.point), myId);
          }}
          onWheel={(e) => addFov(e.wheelDelta * -0.01)}
        >
          {displayType === "sphere" ? (
            <projectedMaterial
              key={ProjectedMaterial.key}
              ref={mat}
              map={tex}
            />
          ) : (
            <meshBasicMaterial
              toneMapped={false}
              side={THREE.BackSide}
              map={tex}
            />
          )}
        </Sphere>
      </group>
    </>
  );
}

function MyCamera() {
  const { azimuth, polaris } = useStore((state) => state.angle);

  const fov = useStore((state) => state.fov);

  return (
    <PerspectiveCamera
      name="cam"
      fov={fov}
      //ref={ref}
      //rotation-y={rot}
      rotation={[polaris + Math.PI / 2, azimuth, 0]}
      rotation-order="YXZ"
    />
  );
}

function MyGhost() {
  const size = useStore((state) => state.size);
  const myId = useMyId();
  const color = colors[myId % colors.length];
  const name = useStore((state) => state.name);
  const reactions = useStore((state) => state.reactions);
  const comments = useStore((state) => state.comments);
  const comment = Object.entries(comments).findLast(
    ([_, { to, from }]) => myId === from
  );

  const reaction = reactions.findLast((r) => r.id === myId);
  const mic = useStore((state) => state.mic);

  return (
    <>
      <Suspense fallback={null}>
        <Head color={color} scale={size + map(mic, 0.15, 1, 0, 1)}>
          <Html center>
            <Label2 css={{ background: color }}>{name}</Label2>
            {comment && <Comment area={"bottom"}>{comment[1].text}</Comment>}

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
          </Html>
        </Head>
      </Suspense>
      {/* <RoundedBox
        args={[1, 1, 1]}
        scale={size + map(mic, 0.15, 1, 0, 1)}
        radius={0.25}
      >
        <meshStandardMaterial color={color} toneMapped={false} />
        
            </RoundedBox> */}
    </>
  );
}

function Wire() {
  const props = useControls({
    dash: true,
    dashInvert: true,
    thickness: { value: 0.01, min: 0, max: 1, step: 0.0001 },
    dashRepeats: { value: 1, min: 0, max: 10 },
    dashLength: { value: 0.1, min: 0.1, max: 1 },
    colorBackfaces: true,
    strokeOpacity: { value: 0.5, min: 0, max: 1 },
    fillMix: { value: 1, min: 0, max: 1 },
    fillOpacity: { value: 0, min: 0, max: 1 },
  });

  const [simplify, set] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      set(true);
    }, 1);
  }, []);

  return (
    <Wireframe
      simplify={simplify} // Remove some edges from wireframes
      //fill={"#00ff00"} // Color of the inside of the wireframe
      //fillMix={1} // Mix between the base color and the Wireframe 'fill'. 0 = base; 1 = wireframe
      //fillOpacity={0.01} // Opacity of the inner fill
      stroke={"#ffffff"} // Color of the stroke
      //strokeOpacity={0.5} // Opacity of the stroke
      //colorBackfaces={false} // Whether to draw lines that are facing away from the camera
      backfaceStroke={"#cccccc"} // Color of the lines that are facing away from the camera
      squeeze={false} // Narrow the centers of each line segment
      {...props}
      strokeOpacity={1}
    />
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
  //const edge = useStore((state) => state.edge);
  const displayType = useStore((state) => state.displayType);
  const comments = useStore((state) => state.comments);
  const reactions = useStore((state) => state.reactions);

  const [showMouse, set] = useState(false);

  useKeyPress("c", () => {
    set((b) => !b);
  });
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
      {others &&
        others.length > 0 &&
        others.map(({ presence, connectionId, name }) => {
          if (!presence) return;
          //console.log(presence.cursor, presence.angle);
          const pos = latlng2xyz(
            presence.cursor.azimuth,
            presence.cursor.polaris,
            400
          );

          const angle = latlng2xyz(
            (presence.angle.azimuth * 180) / Math.PI,
            (presence.angle.polaris * 180) / Math.PI,
            400
          );

          const angleProj = new THREE.Vector3(
            angle[0],
            angle[1],
            angle[2]
          ).project(camera);

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
              {presence.attention && (
                <Attention
                  style={{
                    top: `${-projection.y * 50 + 50}%`,
                    left: `${projection.x * 50 + 50}%`,
                    color,
                  }}
                />
              )}
              {showMouse && (
                <svg
                  style={{
                    position: "absolute",
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
              )}

              {displayType === "surround" && (
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
      {displayType === "compass" && <Rader />}
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

export const Comment = styled("div", {
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

function Camera() {
  const fov = useStore((state) => state.fov);
  return <PerspectiveCamera position={[0, 0, 0.001]} makeDefault fov={fov} />;
}

function OtherGhost() {
  const others = useStore((state) => state.liveblocks.others);
  const setInner = useStore((state) => state.setInner);
  const setSize = useStore((state) => state.setSize);
  const reactions = useStore((state) => state.reactions);
  const comments = useStore((state) => state.comments);

  useControls({
    inner: { value: 45, min: 10, max: 60, onChange: setInner },
    size: { value: 2, min: 1, max: 50, onChange: setSize },
  });
  return (
    others.length > 0 &&
    others.map(({ presence, connectionId }) => {
      const reaction = reactions.findLast((r) => r.id === connectionId);
      const comment = Object.entries(comments).findLast(
        ([_, { to, from }]) => connectionId === from
      );
      return (
        <group
          key={connectionId}
          rotation-order="YXZ"
          rotation={[
            presence.angle.polaris - Math.PI / 2,
            presence.angle.azimuth,
            0,
          ]}
        >
          <Suspense fallback={null}>
            <Ghost
              color={colors[connectionId % colors.length]}
              name={presence.name}
              fov={presence.fov}
              mic={presence.mic}
              reaction={reaction}
              comment={comment}
            />
          </Suspense>
        </group>
      );
    })
  );
}

function Grid() {
  const inner = useStore((state) => state.inner);
  const [grid, set] = useState(true);

  useKeyPress("g", () => {
    set((b) => !b);
  });

  const stepback = useStore((state) => state.stepback);

  return (
    stepback &&
    grid && (
      <>
        <Sphere args={[inner, 24, 24]}>
          {/* <meshBasicMaterial /> */}
          <Circle args={[inner]} rotation-x={-Math.PI / 2}>
            <meshBasicMaterial
              depthTest={false}
              color="white"
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
            />
            <Edges color="white" />
          </Circle>
          <Line
            color={"white"}
            points={[
              [0, 0, inner],
              [0, 0, -inner],
            ]}
            thickness={0.1}
            opacity={0.2}
            transparent
            depthTest={false}
          />
          <Line
            color={"white"}
            points={[
              [inner, 0, 0],
              [-inner, 0, 0],
            ]}
            thickness={0.1}
            opacity={0.2}
            transparent
            depthTest={false}
          />
          <Line
            color={"white"}
            points={[
              [0, inner, 0],
              [0, -inner, 0],
            ]}
            thickness={0.1}
            opacity={0.2}
            transparent
            depthTest={false}
          />
          <Wire />
        </Sphere>
      </>
    )
  );
}

function Ghosts() {
  const stepback = useStore((state) => state.stepback);

  return (
    stepback && (
      <>
        <OtherGhost />
        <MyGhost />
      </>
    )
  );
}

function Indicator() {
  //const { hud } = useControls({ hud: false });
  const displayType = useStore((state) => state.displayType);
  const Wrapper = displayType === "sphere2" ? Hud : Fragment;
  return (
    <Wrapper>
      <Environment preset="city"></Environment>
      <Grid />
      <Ghosts />
    </Wrapper>
  );
}

const radius = 120;
const innerRadius = 30;
const menuItems = [
  //{ label: "📍", color: "#f00" },

  { label: "👍", color: "#f00" },
  { label: "🔥", color: "#0f0" },
  { label: "😍", color: "#00f" },
  { label: "👀", color: "#ff0" },
  { label: "😱", color: "#0ff" },
  { label: "🙁", color: "#f00" },
  //{ label: "Item 6", color: "#f0f" },
  //{ label: "Item 7", color: "#0f0" },
];
const sliceAngle = 360 / menuItems.length;

export default function Scene() {
  const timer = useRef();
  const setAttention = useStore((state) => state.setAttention);
  const displayType = useStore((state) => state.displayType);

  const pieMenuOpen = useStore((state) => state.pieMenuOpen);
  const setPieMenuOpen = useStore((state) => state.setPieMenuOpen);
  const addReaction = useStore((state) => state.addReaction);
  const myId = useMyId();

  const handleMouseDown = (event) => {
    const timeoutId = setTimeout(() => {
      setPieMenuOpen({ x: event.clientX, y: event.clientY });
    }, 250);

    const handleMouseUp = () => {
      clearTimeout(timeoutId);
    };

    const handleMouseMove = () => {
      clearTimeout(timeoutId);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseUp);
      document.removeEventListener("mouseup", handleMouseUp);
      clearTimeout(timeoutId);
    };
  };
  return (
    <>
      <Canvas
        onDoubleClick={(e) => {
          setAttention(true);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => {
            setAttention(false);
          }, 1400);
        }}
        //linear
        onMouseDown={handleMouseDown}
      >
        {/* <directionalLight /> */}
        <Suspense>
          <Still />
        </Suspense>

        <MyCamera />
        <Control />
        <Camera />

        {(displayType === "sphere" || displayType === "sphere2") && (
          <Indicator />
        )}
        <Flags />
        {/* <Cursors /> */}
        {/*  */}
        {displayType === "observatory" && <Observatory />}

        <UI />
      </Canvas>
      {!!pieMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
          onClick={(e) => setPieMenuOpen(null)}
          //onMouseUp={(e) => set(false)}
        >
          <PieContainer
            css={{ width: radius * 2, height: radius * 2 }}
            style={{
              top: pieMenuOpen.y - radius,
              left: pieMenuOpen.x - radius,
            }}
          >
            {menuItems.map((item, index) => (
              <Item
                key={index}
                index={index}
                innerRadius={innerRadius}
                radius={radius}
                sliceAngle={sliceAngle}
                //onClick={() => console.log(index)}
                onClick={() => addReaction(item.label, myId)}
              >
                <div style={{ fontSize: 24 }}>{item.label}</div>
              </Item>
            ))}
            <div
              //onClick={closeMenu}
              style={{
                width: innerRadius * 2,
                height: innerRadius * 2,
                //background: "red",
                position: "absolute",
                borderRadius: "50%",
              }}
            ></div>
          </PieContainer>
        </div>
      )}
    </>
  );
}
