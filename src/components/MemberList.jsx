import useStore from "../store";
import { useState } from "react";
import useMyId from "../hooks/useMyId";
import { button, useControls } from "leva";
import colors from "../utils/colors";
import { map, clamp } from "../utils/math";

export default function MemberList() {
  const others = useStore((state) => state.liveblocks.others);
  const setSelected = useStore((state) => state.setSelected);
  const sync = useStore((state) => state.sync);
  const setSync = useStore((state) => state.setSync);
  const clearComments = useStore((state) => state.clearComments);

  useControls({
    clear: button(clearComments),
  });
  return (
    <div
      style={{
        width: "600px",
        display: "grid",
        gridTemplateColumns: "300px 300px",
        background: "gray",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <ul>
        <li>
          ボディ{" "}
          <input
            type="checkbox"
            checked={sync === "body"}
            onChange={(e) => {
              setSync(e.target.checked ? "body" : null);
            }}
          />
        </li>
        {others.map(
          ({ connectionId, presence }) =>
            presence.name && (
              <li
                key={connectionId}
                style={{ display: "flex", gap: 16, alignItems: "center" }}
                onClick={() => setSelected(connectionId)}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    scale: `${0.5 + map(presence.mic, 0.15, 1, 0, 1)}`,
                    background: colors[connectionId % colors.length],
                  }}
                />
                <div style={{ color: colors[connectionId % colors.length] }}>
                  {presence.name}
                </div>
                <input
                  type="checkbox"
                  checked={sync === connectionId}
                  onChange={(e) => {
                    setSync(e.target.checked ? connectionId : null);
                  }}
                />
              </li>
            )
        )}
      </ul>
      <IndivisualChat />
    </div>
  );
}

function CommentForm({ onSubmit }) {
  const [comment, setComment] = useState("");

  return (
    <form
      onSubmit={(e) => {
        onSubmit && onSubmit(comment);
        setComment("");
        e.preventDefault();
      }}
    >
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="コメントを入力"
      />
      <input disabled={!comment} type="submit" value="送信" />
    </form>
  );
}

function IndivisualChat() {
  const addComment = useStore((state) => state.addComment);

  const setSelected = useStore((state) => state.setSelected);
  const selected = useStore((state) => state.selected);
  const name = useStore((state) => state.name);

  const myId = useMyId();

  const comments = useStore((state) => state.comments);

  const handleSubmit = (comment) => {
    addComment({
      name,
      text: comment,
      timestamp: Date.now().toString(),
      from: myId,
      to: selected,
    });
  };

  console.log(comments);
  return (
    selected && (
      <div>
        <button onClick={() => setSelected(null)}>←</button>
        選択中：
        {selected}
        {Object.entries(comments)
          .filter(
            ([_, { to, from }]) =>
              (to === selected && from === myId) ||
              (from === selected && to === myId)
          )
          .map(([id, { name, text }]) => {
            return (
              <li key={id}>
                {name}:{text}
              </li>
            );
          })}
        <CommentForm onSubmit={handleSubmit} />
      </div>
    )
  );
}
