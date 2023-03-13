import { useEffect, useState } from "react";
import useMic from "./hooks/useMic";
import useStore from "./store";

function Meter({ val }) {
  return (
    <div
      style={{
        width: 10,
        height: 10,
        background: "red",
        margin: 100,
        translate: `${val}px 0`,
      }}
    ></div>
  );
}

function MyMic() {
  const mic = useStore((state) => state.mic);
  const setMic = useStore((state) => state.setMic);

  useMic(setMic);
  return <Meter val={mic} />;
}

function OtherMic() {
  const others = useStore((state) => state.liveblocks.others);
  return others.map(({ connectionId, presence }) => (
    <Meter key={connectionId} val={presence.mic} />
  ));
}

export default function App() {
  //const canvas = useRef();
  //const [val, setVal] = useState(0);
  return (
    <div>
      <MyMic />
      <OtherMic />
    </div>
  );
}
