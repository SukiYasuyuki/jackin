import { useState, useEffect } from "react";
/*
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
*/

const Voice = () => {
  const [isVoiceReceive, setIsVoiceReceive] = useState(false);
  const [message, setMessage] = useState([]);

  const SppechView = () => {
    const btn = document.getElementById("btn");

    const speech = new webkitSpeechRecognition();
    speech.lang = "ja-JP";

    speech.onresult = (event) => {
      setIsVoiceReceive(false);
      speech.stop();
      console.log(event.results);
      if (event.results[0].isFinal) {
        var autotext = event.results[0][0].transcript;
        const createMessage = message;
        createMessage.push(`${autotext}<br />`);
        setMessage(createMessage);
      }
    };

    speech.onend = () => {
      setIsVoiceReceive(true);
      speech.start();
    };

    const startSpeech =
      ("click",
      () => {
        speech.start();
      });

    return (
      <>
        <button id="btn" onClick={startSpeech}>
          音声認識開始
        </button>
        {isVoiceReceive ? "話してください" : "話さないでください"}
        <br />
        メッセージ件数:{message.length}
        <br />
        <div
          dangerouslySetInnerHTML={{
            __html: message,
          }}
        />
      </>
    );
  };

  return (
    <>
      <h2>音声認識</h2>
      <SppechView />
    </>
  );
};
function App() {
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [isRecognizing, setIsRecognizing] = useState(false);

  useEffect(() => {
    if (window.webkitSpeechRecognition) {
      const WebkitSpeechRecognition = window.webkitSpeechRecognition;
      const recognitionInstance = new WebkitSpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "ja-JP";

      recognitionInstance.onresult = (event) => {
        console.log(event.results);
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(transcriptText);
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

  return (
    <div className="App">
      <h1>Speech Recognition</h1>
      <p>{transcript}</p>
      <p>{isRecognizing ? "認識中..." : ""}</p>
      <button onClick={startRecognition}>Start</button>
      <button onClick={stopRecognition}>Stop</button>
    </div>
  );
}

export default App;
