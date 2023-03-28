import useStore from "../store";
import useMyId from "../hooks/useMyId";
import colors from "../utils/colors";
import CommentForm from "./CommentForm";
import { styled } from "@stitches/react";

const List = styled("div", {
  minHeight: 200,
  maxHeight: "30vh",
  padding: "0 20px",
  overflow: "auto",
});

const Comment = styled("div", {
  lineHeight: 1.6,
});

export default function CommentList() {
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

  //console.log(comments);
  return (
    <>
      <List>
        {Object.entries(comments)
          .filter(([_, { to, from }]) =>
            selected
              ? (to === selected && from === myId) ||
                (from === selected && to === myId)
              : to === "*"
          )
          .map(([id, { name, text, from }]) => {
            return (
              <Comment key={id}>
                <span style={{ color: colors[from % colors.length] }}>
                  {name}
                </span>
                {" : "}
                {text}
              </Comment>
            );
          })}
      </List>
      <CommentForm onSubmit={handleSubmit} />
    </>
  );
}

/*
To：
      {selected ? selected : "ALL"}
*/
