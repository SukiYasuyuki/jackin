import { styled } from "@stitches/react";

export default function Emoticon({ roll, mouthOpen, style }) {
  return (
    <svg
      width={64}
      height={64}
      style={{ transformOrigin: "top left", ...style }}
    >
      <g transform={`translate(32 32) rotate(${roll ? roll : 0})`}>
        <circle cx={0} cy={0} r={32} fill="#ffea9e" />
        <circle cx={-11} cy={-6} r={5} fill="#000000c1" />
        <circle cx={11} cy={-6} r={5} fill="#000000c1" />
        <circle cx={0} cy={10} r={20 * mouthOpen} fill="#cb191962" />
      </g>
      <circle />
    </svg>
  );
}
