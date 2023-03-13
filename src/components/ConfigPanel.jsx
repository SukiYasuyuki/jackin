import { useState } from "react";
import { Leva } from "leva";
import useKeyPress from "../hooks/useKeyPress";

export default function ConfigPanel() {
  const [hidden, setHidden] = useState(true);
  useKeyPress("l", () => setHidden((b) => !b));
  return <Leva hidden={hidden} />;
}
