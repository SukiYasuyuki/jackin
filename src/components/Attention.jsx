import { styled, keyframes } from "@stitches/react";

const scaleUp = keyframes({
  "0%": { scale: "0", opacity: 1 },
  "100%": { scale: "120", opacity: 0 },
});

const Ripple = styled("div", {
  position: "absolute",
  inset: 0,
  borderRadius: "50%",
  background: "currentcolor",
  animation: `${scaleUp} 800ms linear`,
});

const Container = styled("div", {
  position: "absolute",
  width: 1,
  height: 1,
  translate: "-50% -50%",
  ">:nth-child(2)": {
    animationDelay: "300ms",
  },
  ">:nth-child(3)": {
    animationDelay: "600ms",
  },
});

export default function Attention(props) {
  return (
    <Container {...props}>
      <Ripple />
      <Ripple />
      <Ripple />
    </Container>
  );
}
