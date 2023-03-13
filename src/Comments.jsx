import { useState } from "react";
import useStore from "./store";

export default function App() {
  const name = useStore((state) => state.name);
  const setName = useStore((state) => state.setName);
  const others = useStore((state) => state.liveblocks.others);
  const comments = useStore((state) => state.comments);
  const addComment = useStore((state) => state.addComment);

  const clearComments = useStore((state) => state.clearComments);

  const [comment, setComment] = useState("");
  const [comment2, setComment2] = useState("");

  const onSubmit = (e) => {
    addComment({
      name,
      text: comment,
      timestamp: Date.now().toString(),
      to: "*",
    });
    //addComment(comment);
    setComment("");
    e.preventDefault();
  };

  const onSubmit2 = (to) => {
    addComment({
      name,
      text: comment2,
      timestamp: Date.now().toString(),
      to,
    });
    //addComment(comment);
    setComment2("");
    //e.preventDefault();
  };

  console.log(comments);
  return (
    <div>
      <button onClick={clearComments}>コメント消去</button>
      <div>名前</div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <div>Comment to All</div>
      <form onSubmit={onSubmit}>
        <input value={comment} onChange={(e) => setComment(e.target.value)} />
        <input type="submit" value="Submit" />
      </form>
      <ul>
        {others.map(({ connectionId, presence }) => (
          <li key={connectionId}>
            {presence.name}
            <form
              onSubmit={(e) => {
                onSubmit2(presence.name);
                e.preventDefault();
              }}
            >
              <input
                value={comment2}
                onChange={(e) => setComment2(e.target.value)}
              />
              <input type="submit" value="Submit2" />
            </form>
            {Object.entries(comments)
              .filter(
                ([_, { to, name: from }]) =>
                  (to === presence.name && from === name) ||
                  (from === presence.name && to === name)
              )
              .map(([id, { name, text }]) => {
                return (
                  <li key={id}>
                    {name}:{text}
                  </li>
                );
              })}
          </li>
        ))}
      </ul>
      <ul>
        {Object.entries(comments)
          .filter(([_, { to }]) => to === "*")
          .map(([id, { name, text }]) => {
            return (
              <li key={id}>
                {name}:{text}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
