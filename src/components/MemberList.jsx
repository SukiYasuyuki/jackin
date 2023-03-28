import useStore from "../store";
import { button, useControls } from "leva";
import colors from "../utils/colors";
import { map, clamp } from "../utils/math";
import { styled } from "@stitches/react";
import * as Switch from "@radix-ui/react-switch";
import Emoticon from "./Emoticon";
import Face from "../Face";
import Icon from "./Icon";
import CommentList from "./CommentList";
import useMyId from "../hooks/useMyId";

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
  //padding: "8px 0",
  paddingBottom: 8,
});
const UserName = styled("div", {
  flex: 1,
  flexShrink: 1,
  textShadow: "0 0 4px rgba(0,0,0,1)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const UserThumbnail = styled("div", {
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "white",
  outlineStyle: "solid",
  outlineOffset: 2,
  outlineWidth: 2,
  position: "relative",
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
  const comments = useStore((state) => state.comments);
  const reactions = useStore((state) => state.reactions);

  const setEdge = useStore((state) => state.setEdge);
  useControls({
    clear: button(clearComments),
    edge: { value: false, onChange: setEdge },
  });
  return (
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
      {/* <Me /> */}
      {others.map(({ connectionId, presence }) => {
        const color = colors[connectionId % colors.length];

        const comment = Object.entries(comments).findLast(
          ([_, { to, from }]) => connectionId === from
        );

        const reaction = reactions.findLast((r) => r.id === connectionId);
        //console.log(comment);

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
                {reaction && (
                  <div
                    style={{
                      fontSize: 40,
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  >
                    {reaction.value}
                  </div>
                )}
              </UserThumbnail>
              <UserName style={{ color: color }}>
                {presence.name || "名無し"}
                {comment && (
                  <div
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.8)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {comment[1].text}
                  </div>
                )}
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
  );
}

function Me() {
  const face = useStore((state) => state.face);
  const name = useStore((state) => state.name);
  const mic = useStore((state) => state.mic);
  const myId = useMyId();
  const speaking = useStore((state) => state.speaking);

  return (
    <UserListItems>
      <UserThumbnail
        style={{
          outlineColor: colors[myId % colors.length],
          outlineWidth: map(mic, 0.15, 1, 2, 10),
        }}
      >
        <Emoticon style={{ scale: "0.5" }} {...face} />
      </UserThumbnail>
      <UserName style={{ color: colors[myId % colors.length] }}>
        {name}
        {speaking !== "" && (
          <div
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.8)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {speaking}
          </div>
        )}
      </UserName>
    </UserListItems>
  );
}
