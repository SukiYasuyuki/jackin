import { styled } from "@stitches/react";
import Icon from "./Icon";

const Button = styled("div", {
  width: 48,
  height: 48,
  borderRadius: "50%",
  display: "grid",
  placeContent: "center",
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

export default function IconButton({ icon, ...props }) {
  return (
    <Button {...props}>
      <Icon path={icon} size={1} />
    </Button>
  );
}
