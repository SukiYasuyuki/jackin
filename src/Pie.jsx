import React, { useState } from "react";
import { styled, keyframes } from "@stitches/react";
import { useControls } from "leva";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import useLongPress from "./hooks/useLongPress";

export const menuItems = [
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

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

export const PieContainer = styled("div", {
  position: "absolute",
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animationDuration: "4000ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  backdropFilter: "blur(20px)",
  //background: "red",
  '&[data-state="open"]': {
    //scale: 1,
    //animationName: slideDownAndFade,
    //transform: "scale(1)",
  },
});

const PieContainer2 = styled(DropdownMenu.Content, {
  position: "absolute",
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animationDuration: "4000ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  backdropFilter: "blur(20px)",
  //background: "red",
  '&[data-state="open"]': {
    //scale: 1,
    //animationName: slideDownAndFade,
    //transform: "scale(1)",
  },
});

const Slice = styled("div", {
  position: "absolute",
  width: "100%",
  height: "100%",
  bottom: "50%",
  right: "50%",
  transformOrigin: "right bottom",
  overflow: "hidden",
  cursor: "pointer",
  "&:hover": {
    opacity: 0.4,
  },
});

const Outer = styled("div", {
  width: "200%",
  height: "200%",
  transformOrigin: "50% 50%",
});

const Inner = styled("div", {
  position: "absolute",
  width: "100%",
  textAlign: "center",
});

const Content = styled("div", {
  display: "inline-block",
});

export function Item({
  children,
  onClick,
  index,
  innerRadius,
  radius,
  sliceAngle,
}) {
  return (
    <Slice
      onClick={onClick}
      style={{
        transform: `rotate(${(index - 0.5) * sliceAngle + 90}deg) skew(${
          90 - sliceAngle
        }deg)`,
      }}
    >
      <Outer
        style={{
          background: `radial-gradient(transparent ${innerRadius}px, rgba(0,0,0,0.5) ${innerRadius}px)`,
          transform: `skew(${sliceAngle - 90}deg) rotate(${
            0.5 * sliceAngle - 90
          }deg)`,
        }}
      >
        <Inner
          style={{
            top: `calc((((50% + ${radius}px) - ${innerRadius}px) / 2) - 1em)`,
          }}
        >
          <Content
            style={{
              transform: `rotate(${-index * sliceAngle}deg)`,
            }}
          >
            {children}
          </Content>
        </Inner>
      </Outer>
    </Slice>
  );
}

const contentStyles = {
  //minWidth: 220,
  //backgroundColor: "black",
  //borderRadius: 6,
  //padding: 5,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
};

const itemStyles = {
  all: "unset",
  fontSize: 13,
  lineHeight: 1,
  //color: violet,
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  height: 25,
  padding: "0 5px",
  position: "relative",
  paddingLeft: 25,
  userSelect: "none",

  "&[data-disabled]": {
    //color: mauve.mauve8,
    pointerEvents: "none",
  },
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
  },

  "&[data-highlighted]": {
    //backgroundColor: violet.violet9,
    //color: violet.violet1,
  },
};
const DropdownMenuItem = styled(DropdownMenu.Item, itemStyles);
//const DropdownMenuContent = styled(DropdownMenu.Content, contentStyles);

const PieMenu = () => {
  const { radius, innerRadius } = useControls({
    radius: { value: 120, min: 50, max: 200 },
    innerRadius: { value: 30, min: 0, max: 100 },
  });
  const [active, setActive] = useState(null);

  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const onLongPress = React.useCallback((event) => {
    setIsOpen(true);
    setPosition({ x: event.clientX, y: event.clientY });
  }, []);

  const closeMenu = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const longPressProps = useLongPress(onLongPress, {
    //onCancel: closeMenu,
    threshold: 300,
  });

  const handleClick = (index) => {
    setActive(index);
  };

  return (
    <div {...longPressProps} style={{ width: "100vw", height: "100vh" }}>
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Portal>
          <PieContainer2
            css={{ width: radius * 2, height: radius * 2 }}
            style={{
              top: position.y - radius,
              left: position.x - radius,
            }}
          >
            {menuItems.map((item, index) => (
              <DropdownMenu.Item
                key={index}
                onSelect={(e) => console.log(item.label)}
              >
                <Item
                  index={index}
                  innerRadius={innerRadius}
                  radius={radius}
                  sliceAngle={sliceAngle}
                  //onClick={() => console.log(index)}
                >
                  <div>{item.label}</div>
                </Item>
              </DropdownMenu.Item>
            ))}
            <div
              onClick={closeMenu}
              style={{
                width: innerRadius * 2,
                height: innerRadius * 2,
                //background: "red",
                position: "absolute",
                borderRadius: "50%",
              }}
            ></div>
          </PieContainer2>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default PieMenu;
