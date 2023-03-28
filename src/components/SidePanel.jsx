import { styled } from "@stitches/react";
import Face from "../Face";
import Icon from "./Icon";
import CommentList from "./CommentList";
import MemberList from "./MemberList";
import useStore from "../store";
import { mdiMenuRight, mdiVideo, mdiMicrophone } from "@mdi/js";

const Container = styled("div", {
  position: "absolute",
  top: 24,
  left: 24,
  width: 256,
  //background: "#111",

  borderRadius: 12,
  overflow: "clip",
  display: "flex",
  flexDirection: "column",
  gap: 1,
  zIndex: 100,
});

const Details = styled("details", {
  //background: "#333",
  background: "rgba(0,0,0,0.3)",
  backdropFilter: "blur(40px)",
});

const Summary = styled("summary", {
  fontSize: 14,
  fontWeight: 600,
  color: "rgba(255, 255, 255, 0.6)",
  height: 48,
  display: "flex",
  alignItems: "center",
  padding: "0 8px",
});

export default function SidePanel() {
  const edge = useStore((state) => state.edge);

  return (
    <Container>
      <Details open>
        <Summary>
          <Icon size={1} path={mdiMenuRight} />
          あなた
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginRight: 4,
              color: "white",
            }}
          >
            <Icon size={0.75} path={mdiMicrophone} />
            <Icon size={0.75} path={mdiVideo} />
          </div>
        </Summary>
        <Face />
      </Details>
      {!edge && (
        <>
          <Details open>
            <Summary>
              <Icon size={1} path={mdiMenuRight} />
              メンバー
            </Summary>
            <MemberList />
          </Details>
          <Details open>
            <Summary>
              <Icon size={1} path={mdiMenuRight} />
              コメント
            </Summary>

            <CommentList />
          </Details>
        </>
      )}
    </Container>
  );
}
