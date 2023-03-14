import React, { useState } from "react";
import { styled } from "@stitches/react";

const menuItems = [
  { label: "Item 1", color: "#f00" },
  { label: "Item 2", color: "#0f0" },
  { label: "Item 3", color: "#00f" },
  { label: "Item 4", color: "#ff0" },
  { label: "Item 5", color: "#0ff" },
  //{ label: "Item 6", color: "#f0f" },
  //{ label: "Item 7", color: "#0f0" },
];

const radius = 150;
const sliceAngle = 360 / menuItems.length;

const Container = styled("div", {
  position: "relative",
  width: radius * 2,
  height: radius * 2,
  borderRadius: "50%",
  backgroundColor: "#000",
  overflow: "hidden",
});

const Slice = styled("a", {
  position: "absolute",
  width: "100%",
  height: "100%",
  bottom: "50%",
  right: "50%",
  transformOrigin: "right bottom",
  overflow: "hidden",
  "&:hover": {
    opacity: 0.4,
  },
});

const Content = styled("div", {
  width: "200%",
  height: "200%",
  transformOrigin: "50% 50%",
  background: "radial-gradient(transparent 30px, white 30px)",
  //display: "flex",
  //alignItems: "center",
});

const PieMenu = () => {
  const [active, setActive] = useState(null);

  const handleClick = (index) => {
    setActive(index);
  };

  return (
    <Container>
      {menuItems.map((item, index) => (
        <Slice
          key={index}
          href="#"
          onClick={() => handleClick(index)}
          style={{
            //background: item.color,
            transform: `rotate(${index * sliceAngle + 90}deg) skew(${
              90 - sliceAngle
            }deg)`,
          }}
        >
          <Content
            style={{
              transform: `skew(${sliceAngle - 90}deg) rotate(${
                90 - sliceAngle
              }deg)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "100%",
                textAlign: "center",
                top: "calc((((50% + 150px) - 30px) / 2) - 1em)",
                background: "blue",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  transform: `rotate(${index * sliceAngle}deg)`,
                  color: "red",
                  background: "blue",
                }}
              >
                {"as"}
              </div>
            </div>
          </Content>
        </Slice>
      ))}
    </Container>
  );
};

export default PieMenu;
