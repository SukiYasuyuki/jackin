import { useState, useEffect, useRef } from "react";
import useStore from "./store";
import { motion, AnimatePresence } from "framer-motion";
import Snd from "snd-lib";
import { keyframes, styled } from "@stitches/react";

const snd = new Snd();
snd.load(Snd.KITS.SND01);

const scaleUp = keyframes({
  "0%": { scale: "0 1" },
  "100%": { scale: "1 1" },
});

const Bar = styled("div", {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: 4,
  background: "rgba(255, 255, 255, 0.4)",
  "&:after": {
    content: "",
    position: "absolute",
    inset: 0,
    background: "White",
    animation: `${scaleUp} 10000ms infinite linear`,
    transformOrigin: "left",
  },
});

const Input = styled("input", {
  all: "unset",
  display: "block",
  height: 50,
  padding: "0 8px",
  "&::placeholder": {
    color: "rgba(255, 255, 255, 0.4)",
  },
});

function CommentInput() {
  const [comment, setComment] = useState("");
  const timer = useRef();
  const setCapture = useStore((state) => state.setCapture);

  const finish = () => {
    setCapture(null);
    snd.play(Snd.SOUNDS.TRANSITION_DOWN);
  };
  useEffect(() => {
    timer.current = setTimeout(finish, 6000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <form
      style={{
        width: 400,
        //background: "red",
        marginBottom: 50,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        pointerEvents: "auto",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        finish();
      }}
    >
      <Input
        type="text"
        placeholder="テキストを入力できます"
        onChange={(e) => {
          setComment(e.target.value);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(finish, 10000);
        }}
        value={comment}
        autoFocus
      />

      <Bar key={comment} />
    </form>
  );
}

export default function Capture() {
  const capture = useStore((state) => state.capture);

  return (
    <AnimatePresence>
      {capture && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "clip",
            pointerEvents: "none",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              pointerEvents: "none",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.img
            src={capture.data}
            width={"100%"}
            height={"100%"}
            style={{
              position: "absolute",
              inset: 0,
            }}
            initial={{
              x: 0,
              y: 0,
              clipPath: `circle(0 at ${capture.x}px ${capture.y}px)`,
            }}
            animate={{
              x: 0,
              y: 0,
              clipPath: `circle(200px at ${capture.x}px ${capture.y}px)`,
            }}
            exit={{
              x: capture.width * 0.5 - capture.x,
              y: capture.height - 100 - capture.y,
              opacity: 0,
              clipPath: `circle(0 at ${capture.x}px ${capture.y}px)`,
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "auto",
              fontSize: 24,
              fontWeight: "bold",
              left: capture.x,
              top: capture.y + 220,
              translate: "-50%",
            }}
            initial={{
              y: 0,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            exit={{
              y: 100,
              opacity: 0,
              scale: 0,
            }}
          >
            <CommentInput />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
