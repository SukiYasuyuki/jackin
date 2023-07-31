import { PieContainer, Item } from "../Pie";
import useStore from "../store";
import useMyId from "../hooks/useMyId";

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

export function ContextMenu() {
  const pieMenuOpen = useStore((state) => state.pieMenuOpen);
  const setPieMenuOpen = useStore((state) => state.setPieMenuOpen);
  const addReaction = useStore((state) => state.addReaction);
  const myId = useMyId();

  return (
    !!pieMenuOpen && (
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
    )
  );
}
