import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import useLongPress from "./hooks/useLongPress";
import { styled, keyframes } from "@stitches/react";

const LongPressMenu = ({
  children,
  items = [{ text: "aaa" }, { text: "bbb" }, { text: "ccc" }, { text: "ddd" }],
}) => {
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

  return (
    <div {...longPressProps} style={{ width: "100vw", height: "100vh" }}>
      {children}
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Portal>
          <DropdownMenuContent
            style={{ position: "absolute", top: position.y, left: position.x }}
          >
            {items.map((item) => (
              <DropdownMenuItem
                key={item.text}
                onSelect={(e) => console.log(item.text)}
              >
                {item.text}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default LongPressMenu;

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

const contentStyles = {
  minWidth: 220,
  backgroundColor: "black",
  borderRadius: 6,
  padding: 5,
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

const DropdownMenuItem = styled(DropdownMenu.Item, itemStyles);
const DropdownMenuContent = styled(DropdownMenu.Content, contentStyles);
