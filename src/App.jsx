import React, { useEffect } from "react";
import useStore from "./store";
import useLongPress from "./hooks/useLongPress";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

//import "./App.css";
import { useState } from "react";
import Scene from "./Scene";
import Mic from "./Mic";
import Face from "./Face";
import Hand from "./Hand";
import Reaction from "./Reaction";
import Comments from "./Comments";
import LogIn from "./components/LogIn";
import ConfigPanel from "./components/ConfigPanel";
import SidePanel from "./components/SidePanel";
import Stream from "./Stream";
import useMic from "./hooks/useMic";
import VolumeMeter from "./VolumeMeter";
import PlayerControl from "./components/PlayerControl";
import Functions from "./components/Functions";
import PieMenu from "./Pie";
import Tile from "./Tile";
import LongPressMenu from "./LongPressMenu";
import Emoticon from "./components/Emoticon";
import Voice from "./VoiceRecognition";
import { PieContainer, Item } from "./Pie";
import Attention from "./components/Attention";
import FlyingReaction from "./components/FlyingReaction";
import useMyId from "./hooks/useMyId";
import colors from "./utils/colors";
import God from "./God";
import Control from "./Control";

import CommentForm from "./components/CommentForm";
import { styled } from "@stitches/react";

//import { LiveKitRoom, VideoConference } from "@livekit/components-react";

const App = () => {
  const {
    liveblocks: { enterRoom, leaveRoom },
  } = useStore();

  useEffect(() => {
    enterRoom("room-id");
    return () => {
      leaveRoom("room-id");
    };
  }, [enterRoom, leaveRoom]);

  //const cursor = useStore((state) => state.cursor);

  const setCursor = useStore((state) => state.setCursor);
  const sync = useStore((state) => state.sync);
  const setSync = useStore((state) => state.setSync);

  const others = useStore((state) => state.liveblocks.others);
  const othersCursors = others.map((user) => user.presence.cursor);

  const [text, set] = useState("");

  const addComment = useStore((state) => state.addComment);
  const comments = useStore((state) => state.comments);

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onPointerMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
    >
      <Scene />
      {/* <div
        style={{
          width: 10,
          height: 10,
          background: "red",
          position: "absolute",
          top: cursor.y,
          left: cursor.x,
        }}
      /> */}
      {/* <input
        type={"number"}
        value={sync}
        onChange={(e) => setSync(e.target.value)}
      />

      <input type={"text"} value={text} onChange={(e) => set(e.target.value)} />
      <button onClick={() => addComment(text)}>送信</button>
      {others.map(({ connectionId, presence }) => (
        <div
          key={connectionId}
          style={{
            width: 10,
            height: 10,
            background: "blue",
            position: "absolute",
            top: presence.cursor.y,
            left: presence.cursor.x,
          }}
        />
      ))}
      {comments.map((comment, i) => (
        <div key={i}>{comment}</div>
      ))}
      */}
    </div>
  );
};

/*
function App2() {
  return (
    <LiveKitRoom
      token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzgwNzM0MDksImlzcyI6IkFQSVV6bXNhYkFMWlVnTCIsIm5iZiI6MTY3ODA3MjUwOSwic3ViIjoic29tZSIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJ0aGluZyIsInJvb21Kb2luIjp0cnVlfX0.p0UAJg0hPcHgR-l5PHhLecP9fgy2wsx7gEMVCVxAfc4"
      serverUrl="wss://jackin-7efzzxlx.livekit.cloud"
      connect={true}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
*/

function MyAttention() {
  const attention = useStore((state) => state.attention);
  const mouse = useStore((state) => state.mouse);
  const myId = useMyId();
  return (
    attention && (
      <Attention
        style={{
          top: mouse.y,
          left: mouse.x,
          color: colors[myId % colors.length],
        }}
      />
    )
  );
}

function App2() {
  const {
    liveblocks: { enterRoom, leaveRoom },
  } = useStore();

  useEffect(() => {
    enterRoom("room-id");
    return () => {
      leaveRoom("room-id");
    };
  }, [enterRoom, leaveRoom]);

  const name = useStore((state) => state.name);
  const setMouse = useStore((state) => state.setMouse);
  const setMic = useStore((state) => state.setMic);

  useMic(setMic);
  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onPointerMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
    >
      <ConfigPanel />
      {!!name ? (
        <div style={{ width: "100vw", height: "100vh", position: "fixed" }}>
          <Scene />
          <MyAttention />
          {/* <PlayerControl /> */}
          {/* <SidePanel /> */}
          <Functions />
          <Comment />
        </div>
      ) : (
        <LogIn />
      )}
      {/* <Pie /> */}
    </div>
  );
}

function Pie() {
  const radius = 120;
  const innerRadius = 30;

  const controlEnabled = useStore((state) => state.controlEnabled);
  const setControlEnabled = useStore((state) => state.setControlEnabled);
  return (
    <DropdownMenu.Root
      open={!controlEnabled}
      onOpenChange={(val) => setControlEnabled(!val)}
    >
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <PieContainer
            css={{ width: radius * 2, height: radius * 2 }}
            style={{
              top: 200, //position.y - radius,
              left: 200, //position.x - radius,
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
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default App2;

const menuItems = [
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

function Comment() {
  const stepback = useStore((state) => state.stepback);
  const addComment = useStore((state) => state.addComment);
  const name = useStore((state) => state.name);
  const myId = useMyId();
  const handleSubmit = (comment) => {
    addComment({
      name,
      text: comment,
      timestamp: Date.now().toString(),
      from: myId,
      to: "*",
    });
  };

  return (
    stepback && (
      <CommentInput>
        <CommentForm onSubmit={handleSubmit} />
      </CommentInput>
    )
  );
}
const CommentInput = styled("div", {
  position: "absolute",
  bottom: 32,
  backdropFilter: "blur(40px)",
  width: 320,
  left: "calc(50% - 160px)",
  borderRadius: "12px",
  overflow: "clip",
});
