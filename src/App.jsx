import React, { useEffect } from "react";
import useStore from "./store";

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
import MemberList from "./components/MemberList";
import Stream from "./Stream";
import useMic from "./hooks/useMic";
import VolumeMeter from "./VolumeMeter";
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
  const setMic = useStore((state) => state.setMic);

  useMic(setMic);
  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      //onPointerMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
    >
      <ConfigPanel />
      {!!name ? (
        <div style={{ width: "100vw", height: "100vh" }}>
          <Scene />
          <MemberList />
        </div>
      ) : (
        <LogIn />
      )}
    </div>
  );
}

export default Stream;
