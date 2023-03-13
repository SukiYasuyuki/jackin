import { useState } from "react";
import useStore from "../store";

export default function LogIn() {
  const [name, set] = useState("");
  const setName = useStore((state) => state.setName);

  return (
    <form
      onSubmit={(e) => {
        setName(name);
        e.preventDefault();
      }}
    >
      <label>あなたの名前</label>

      <input
        type="text"
        value={name}
        placeholder={"表示される名前"}
        onChange={(e) => set(e.target.value)}
      />
      <input disabled={!name} type="submit" value="参加する" />
    </form>
  );
}
