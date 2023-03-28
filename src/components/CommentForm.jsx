import { useState, useEffect } from "react";
import { styled } from "@stitches/react";
import { mdiSend } from "@mdi/js";
import Icon from "./Icon";
import { mdiMicrophone } from "@mdi/js";
import useStore from "../store";

const Form = styled("form", {
  height: 40,
  display: "flex",
  //alignItems: "center",
});

const Input = styled("input", {
  border: "none",
  padding: "0 16px",
  background: "rgba(0,0,0, 0.1)",
});

const Button = styled("div", {
  height: 40,
  width: 40,
  display: "grid",
  borderRadius: 12,
  placeContent: "center",
  cursor: "pointer",
  variants: {
    active: {
      true: {
        background: "white",
        color: "black",
      },
    },
  },
});

export default function CommentForm({ onSubmit }) {
  const [comment, setComment] = useState("");

  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(false);

  const setSpeaking = useStore((state) => state.setSpeaking);

  useEffect(() => {
    if (window.webkitSpeechRecognition) {
      const WebkitSpeechRecognition = window.webkitSpeechRecognition;
      const recognitionInstance = new WebkitSpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "ja-JP";

      recognitionInstance.onresult = (event) => {
        let interimTranscript = "";
        console.log(interimTranscript);
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          setSpeaking(transcriptText);
          if (event.results[i].isFinal) {
            onSubmit(transcriptText);
            //setComment(transcriptText);
          } else {
            interimTranscript += transcriptText;
          }
        }
      };

      recognitionInstance.onstart = () => {
        setIsRecognizing(true);
      };

      recognitionInstance.onend = () => {
        setIsRecognizing(false);
      };

      setRecognition(recognitionInstance);
    } else {
      alert(
        "This browser does not support WebkitSpeechRecognition. Please try with a webkit-based browser like Google Chrome."
      );
    }
  }, []);

  const startRecognition = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const toggleRecognition = () => {
    if (recognition) {
      if (isRecognizing) {
        recognition.stop();
      } else {
        recognition.start();
      }
    }
  };

  return (
    <Form
      onSubmit={(e) => {
        onSubmit && onSubmit(comment);
        setComment("");
        e.preventDefault();
      }}
    >
      <Button active={isRecognizing} onClick={toggleRecognition}>
        <Icon size={0.75} path={mdiMicrophone} />
      </Button>
      <Input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="コメントを入力"
        css={{ flex: 1, padding: "0 4px" }}
      />
      <Input disabled={!comment} type="submit" />
    </Form>
  );
}
