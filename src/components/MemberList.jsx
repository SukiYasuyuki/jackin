import useStore from "../store";
import { useState } from "react";
import useMyId from "../hooks/useMyId";
import { button, useControls } from "leva";
import colors from "../utils/colors";
import { map, clamp } from "../utils/math";
import { styled } from "@stitches/react";
import * as Switch from "@radix-ui/react-switch";
import Emoticon from "./Emoticon";
import Face from "../Face";

const Container = styled("div", {
  position: "absolute",
  top: 24,
  left: 24,
  width: 280,
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(20px)",
  borderRadius: 16,
  overflow: "clip",
});

const UserListItems = styled("div", {
  display: "flex",
  alignItems: "center",
  height: 56,
  gap: 16,
  padding: "0 20px",
  "&:hover": {
    cursor: "pointer",
    background: "rgba(255, 255, 255, 0.05)",
  },
});
const UserList = styled("div", {
  padding: "8px 0",
});
const UserName = styled("div", {
  flex: 1,
  textShadow: "0 0 4px rgba(0,0,0,1)",
});

const UserThumbnail = styled("div", {
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "white",
  outlineStyle: "solid",
  outlineOffset: 2,
  outlineWidth: 2,
});

const SwitchRoot = styled(Switch.Root, {
  all: "unset",
  width: 42,
  height: 25,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "9999px",
  position: "relative",
  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
  "&:focus": { boxShadow: `0 0 0 2px black` },
  '&[data-state="checked"]': { backgroundColor: "currentcolor" },
});

const SwitchThumb = styled(Switch.Thumb, {
  display: "block",
  width: 21,
  height: 21,
  backgroundColor: "white",
  borderRadius: "9999px",
  //boxShadow: `0 2px 2px ${blackA.blackA7}`,
  transition: "transform 100ms",
  transform: "translateX(2px)",
  willChange: "transform",
  '&[data-state="checked"]': { transform: "translateX(19px)" },
});

export default function MemberList() {
  const others = useStore((state) => state.liveblocks.others);
  const setSelected = useStore((state) => state.setSelected);
  const sync = useStore((state) => state.sync);
  const setSync = useStore((state) => state.setSync);
  const clearComments = useStore((state) => state.clearComments);

  const edge = useStore((state) => state.edge);
  const setEdge = useStore((state) => state.setEdge);
  useControls({
    clear: button(clearComments),
    edge: { value: false, onChange: setEdge },
  });
  return (
    <Container style={{ opacity: edge ? 0 : 1 }}>
      <Face />
      <div>メンバーリスト</div>
      <UserList>
        <UserListItems>
          <UserThumbnail>
            <Emoticon style={{ scale: "0.5" }} />
          </UserThumbnail>
          <UserName>ボディ</UserName>
          <SwitchRoot
            style={{ color: "gray" }}
            checked={sync === "body"}
            onCheckedChange={(checked) => {
              setSync(checked ? "body" : null);
            }}
          >
            <SwitchThumb />
          </SwitchRoot>
        </UserListItems>
        {others.map(({ connectionId, presence }) => {
          const color = colors[connectionId % colors.length];
          return (
            true && ( //presence.name
              <UserListItems
                key={connectionId}
                //onClick={() => setSelected(connectionId)}
              >
                <UserThumbnail
                  style={{
                    outlineColor: color,
                    outlineWidth: map(presence.mic, 0.15, 1, 2, 10),
                  }}
                  //scale: `${0.5 + )}`,
                >
                  <Emoticon style={{ scale: "0.5" }} {...presence.face} />
                </UserThumbnail>

                <UserName style={{ color: color }}>
                  {presence.name || "名無し"}
                </UserName>
                <SwitchRoot
                  style={{ color }}
                  checked={sync === connectionId}
                  onCheckedChange={(checked) => {
                    setSync(checked ? connectionId : null);
                  }}
                >
                  <SwitchThumb />
                </SwitchRoot>
              </UserListItems>
            )
          );
        })}
      </UserList>
      {/* <IndivisualChat /> */}
      <Chat />
    </Container>
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
      style={{ display: "flex" }}
    >
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="コメントを入力"
        style={{ flex: 1 }}
      />
      <input disabled={!comment} type="submit" value="送信" />
    </form>
  );
}

function Chat() {
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
      to: selected ? selected : "*",
    });
  };

  console.log(comments);
  return (
    <div
      style={{
        paddingTop: 24,
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div>チャット</div>
      {/* <button onClick={() => setSelected(null)}>←</button> */}
      To：
      {selected ? selected : "ALL"}
      <div style={{ minHeight: 200 }}>
        {Object.entries(comments)
          .filter(([_, { to, from }]) =>
            selected
              ? (to === selected && from === myId) ||
                (from === selected && to === myId)
              : to === "*"
          )
          .map(([id, { name, text, from }]) => {
            return (
              <li key={id}>
                <span style={{ color: colors[from % colors.length] }}>
                  {name}
                </span>
                {" : "}
                {text}
              </li>
            );
          })}
      </div>
      <CommentForm onSubmit={handleSubmit} />
    </div>
  );
}
