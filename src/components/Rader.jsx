import { styled } from "@stitches/react";
import useStore from "../store";
import colors from "../utils/colors";
import { useCallback, useRef } from "react";
import useMyId from "../hooks/useMyId";

function Pin({ rx = 10, ...props }) {
  const angle = (Math.PI * 3) / 4;
  const px = rx * Math.cos(angle);
  const py = rx * Math.sin(angle);

  return (
    <path
      d={`M ${px} ${py} A ${rx} ${rx}, 0, 1, 0, ${px} ${-py} L${
        -rx * 1.414
      } 0 Z`}
      {...props}
    />
  );
}
function Angle({ cx = 0, cy = 0, fov = 60, rad, r = 120, color = "yellow" }) {
  const x = Math.sin(-rad);
  const y = -Math.cos(rad);

  const deg = fov / 2;
  const angle = (Math.PI * deg) / 180;
  const px = r * Math.cos(angle);
  const py = r * Math.sin(angle);

  return (
    <g transform={`translate(${cx} ${cy})`}>
      <line
        x1={0}
        y1={0}
        x2={100 * x}
        y2={100 * y}
        stroke={color}
        strokeDasharray={"2 2"}
      />
      <path
        d={`M ${px} ${py} A ${r} ${r}, 0, 0, 0, ${px} ${-py}`}
        stroke={color}
        fill="none"
        strokeWidth={2}
        transform={`rotate(${-90 - (rad * 180) / Math.PI})`}
      />
      <path
        d={`M ${px} ${py} A ${r} ${r}, 0, 0, 0, ${px} ${-py} L0,0 L ${px} ${py}`}
        fill={color}
        fillOpacity={0.2}
        transform={`rotate(${-90 - (rad * 180) / Math.PI})`}
      />
      <polygon
        points="-8,-5 -8,5 0,0"
        fill={color}
        transform={`rotate(${-90 - (rad * 180) / Math.PI}) translate(${r} 0)`}
      />
      <Pin fill={color} transform={`rotate(${90 - (rad * 180) / Math.PI})`} />
    </g>
  );
}

function Lines({ r = 120 }) {
  return [...Array(120)].map((_, i) => {
    const rad = (i / 120) * Math.PI * 2;
    const r1 = r;
    const r2 = i % 10 === 0 ? r + 12 : r + 4;
    return (
      <line
        key={i}
        x1={Math.sin(rad) * r1}
        y1={Math.cos(rad) * r1}
        x2={Math.sin(rad) * r2}
        y2={Math.cos(rad) * r2}
        stroke="white"
        fill="none"
        strokeWidth={i % 10 === 0 ? 2 : 1}
      />
    );
  });
}

function MyAngle() {
  const myId = useMyId();
  const { azimuth: rad } = useStore((state) => state.angle);
  const fov = useStore((state) => state.fov);
  const i = myId % 8;

  const center = true;

  return (
    <Angle
      rad={rad}
      fov={fov}
      color={colors[i]}
      cx={center ? 0 : 40 * Math.sin((i * Math.PI * 2) / 8)}
      cy={center ? 0 : 40 * Math.cos((i * Math.PI * 2) / 8)}
    />
  );
}

function OtherAngle() {
  const others = useStore((state) => state.liveblocks.others);
  return (
    others.length > 0 &&
    others.map(({ presence, connectionId }) => {
      const rad2 = presence.angle.azimuth;
      const fov = presence.fov;
      //const x2 = Math.sin(-rad2);
      //const y2 = -Math.cos(rad2);
      const i = connectionId % 8;
      const center = true;

      return (
        <Angle
          key={connectionId}
          rad={rad2}
          fov={fov}
          color={colors[i]}
          r={100 + (connectionId % 8) * 2}
          cx={center ? 0 : 40 * Math.sin((i * Math.PI * 2) / 8)}
          cy={center ? 0 : 40 * Math.cos((i * Math.PI * 2) / 8)}
        />
      );
    })
  );
}

const RaderContainer = styled("div", {
  perspective: 2000,
  position: "absolute",
  // bottom: 0,
  // right: 0,
  bottom: -120,
  right: "calc(50% - 180px)",
});

const RaderView = styled("svg", {
  width: 360,
  height: 360,
  overflow: "visible",
  transform: "rotateX(60deg)",
});

const Text = styled("text", {
  fill: "white",
  //text-align: center;
  textAnchor: "middle",
  userSelect: "none",
  alignmentBaseline: "middle",
  fontWeight: "bold",
  pointerEvents: "auto",
  cursor: "pointer",
});

const BaseCircle = styled("circle", {
  fill: "rgba(0, 0, 0, 0.5)",
});

const ResetCircle = styled("circle", {
  fill: "rgba(0, 0, 0, 1)",
  pointerEvents: "auto",
  cursor: "pointer",
});

export default function Rader({ controls }) {
  /*
  const front = useCallback(() => {
    if(controls) {
      controls.setAzimuthalAngle(0)
      controls.setPolarAngle(Math.PI/2)
    }
  }, [controls])

  const back = useCallback(() => {
    if(controls) {
      controls.setAzimuthalAngle(Math.PI)
      controls.setPolarAngle(Math.PI/2)
    }
  }, [controls])
  
  const left = useCallback(() => {
    if(controls) {
      controls.setAzimuthalAngle(Math.PI/2)
      controls.setPolarAngle(Math.PI/2)
    }
  }, [controls])

  const right = useCallback(() => {
    if(controls) {
      controls.setAzimuthalAngle(-Math.PI/2)
      controls.setPolarAngle(Math.PI/2)
    }
  }, [controls])
  */
  const { azimuth: rad } = useStore((state) => state.angle);

  return (
    <RaderContainer>
      <RaderView>
        <g
          transform={`translate(200, 200) rotate(${
            true ? (rad * 180) / Math.PI : 0
          }) scale(2)`}
        >
          <BaseCircle cx={0} cy={0} r={100} />
          {/*[...Array(8)].map((_, i) => (
            <circle cx={40 * Math.sin(i * Math.PI * 2 / 8)} cy={40 * Math.cos(i * Math.PI * 2 / 8)} r={10} fill="#333"/>
          ))*/}
          <Lines />
          <OtherAngle />
          <MyAngle />
          <ResetCircle cx={0} cy={0} r={24}></ResetCircle>
          <path d={"M0 -10, L6 8, L0 4, L-6 8 Z"} fill="white" />
          <Text x={0} y={-150}>
            前
          </Text>
          <Text x={150} y={0}>
            右
          </Text>
          <Text x={-150} y={0}>
            左
          </Text>
          <Text x={0} y={150}>
            後
          </Text>
        </g>
      </RaderView>
    </RaderContainer>
  );
}
