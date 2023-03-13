import React, { useState, useCallback, useEffect, useMemo } from "react";

import FlyingReaction from "./components/FlyingReaction";
import ReactionSelector from "./components/ReactionSelector";
import useInterval from "./hooks/useInterval";
import useStore from "./store";

export default function App() {
  const reactions = useStore((state) => state.reactions);
  const updateReactions = useStore((state) => state.updateReactions);
  const addReaction = useStore((state) => state.addReaction);
  const setCursor = useStore((state) => state.setCursor);
  const cursor = useStore((state) => state.cursor);

  useInterval(updateReactions, 1000);

  const [modal, setModal] = useState(false);

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onPointerMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      //onPointerDown={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      onClick={() => setModal((b) => !b)}
    >
      <div
        style={{
          width: 10,
          height: 10,
          background: "red",
          position: "absolute",
          top: cursor.y,
          left: cursor.x,
        }}
      >
        {modal && <ReactionSelector setReaction={addReaction} />}
      </div>
      {reactions.map((reaction) => (
        <FlyingReaction
          key={reaction.timestamp.toString()}
          x={reaction.point.x}
          y={reaction.point.y}
          timestamp={reaction.timestamp}
          value={reaction.value}
        />
      ))}
    </div>
  );
}
