import { styled } from "@stitches/react";
import { forwardRef } from "react";
import Icon from "./Icon";

const Button = styled("div", {
  width: 48,
  height: 48,
  borderRadius: "50%",
  display: "grid",
  placeContent: "center",
  backdropFilter: "blur(40px)",
  background: "rgba(0,0,0,0.3)",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
    cursor: "pointer",
  },
  variants: {
    disabled: {
      true: {
        opacity: 0.25,
      },
      false: {},
    },
  },
});

function IconButton({ icon, ...props }, ref) {
  return (
    <Button {...props} ref={ref}>
      <Icon path={icon} size={1} />
    </Button>
  );
}

export default forwardRef(IconButton);
