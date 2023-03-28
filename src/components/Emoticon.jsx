import { styled } from "@stitches/react";
import { useControls } from "leva";
import { map } from "../utils/math";

export default function Emoticon({
  yaw = 0,
  pitch = 0,
  roll = 0,
  mouthOpen = 0.2,
  mouthWide = 0.5,
  leftEyeOpen = 1,
  rightEyeOpen = 1,
  feeling = 0.5,
  size = 64,
  style,
}) {
  //console.log(mouthWide);

  return (
    <Svg style={style} width={size} height={size}>
      <defs>
        <linearGradient id="RadialGradient2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#D96F88" />

          <stop offset="1000%" stopColor="#F09090" />
        </linearGradient>
        <radialGradient id="RadialGradient1" cx="0.25" cy="0.25" r="1">
          <stop offset="0%" stopColor="#F3D192" />
          <stop offset="75%" stopColor="#EBB989" />
          <stop offset="100%" stopColor="#F3D192" />
        </radialGradient>
      </defs>
      <g transform={`translate(32 32) rotate(${roll ? roll : 0})`}>
        <Face />
        {/* <Mouth cx={0} cy={10} ry={10 * mouthOpen + 5} rx={12 * mouthWide} /> */}
        <g
          transform={`scale(${map(Math.abs(yaw), 0, 1, 1, 0.75)} ${map(
            Math.abs(pitch),
            0,
            1,
            1,
            0.75
          )}) translate(${yaw * 20} ${-pitch * 20})`}
        >
          <Eye cx={-11} cy={-6} rx={4} ry={4 * rightEyeOpen} />
          <Eye cx={11} cy={-6} rx={4} ry={4 * leftEyeOpen} />
          <Mouth2 openness={mouthOpen} wideness={mouthWide} feeling={feeling} />
        </g>
      </g>
    </Svg>
  );
}

const Mouth2 = ({ openness = 0.5, wideness = 0.5, feeling = 0.5 }) => {
  const minWidth = 12;
  const minHeight = 8;
  const width = 16 * wideness + minWidth;
  const height = 16 * openness + minHeight;
  const left = -width / 2;
  const right = width / 2;
  const yPos = 12 + 2 * feeling;

  const sideY = yPos - 6 * feeling;
  const topY = yPos - height / 2;
  const bottomY = yPos + height / 2;
  return (
    <path
      d={`
        M${left},${sideY}
        Q${left},${bottomY} ${0},${bottomY}
        Q${right},${bottomY} ${right},${sideY}
        Q${right},${topY} ${0},${topY}
        Q${left},${topY} ${left},${sideY}
        Z
      `}
      fill={"url(#RadialGradient2)"}
    />
  );
};

const Svg = styled("svg", {
  viewBox: "0 0 64 64",
  transformOrigin: "top left",
});

const Face = styled("circle", {
  fill: "url(#RadialGradient1)",
  cx: 0,
  cy: 0,
  r: 32,
});

const Mouth = styled("ellipse", {
  fill: "#cb191962",
});

const Eye = styled("ellipse", {
  fill: "#402A32",
  stroke: "#402A32",
  strokeWidth: 1.5,
});
