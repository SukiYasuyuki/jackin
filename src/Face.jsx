import React, { FC, useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { button, useControls } from "leva";

import { Camera as _Camera } from "@mediapipe/camera_utils/camera_utils";
import { FaceMesh as _FaceMesh } from "@mediapipe/face_mesh/face_mesh";
import { draw } from "./utils/drawCanvas";
import Emoticon from "./components/Emoticon";
import useStore from "./store";
import { map } from "./utils/math";
import colors from "./utils/colors";
import useMyId from "./hooks/useMyId";

const FaceMesh = _FaceMesh || window.FaceMesh;
const Camera = _Camera || window.Camera;

export default function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const resultsRef = useRef();

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const requestRef = useRef(null);

  const setFace = useStore((state) => state.setFace);
  const setMic = useStore((state) => state.setMic);

  const onResults = useCallback((results) => {
    resultsRef.current = results;
    //console.log(results);
    if (results.multiFaceLandmarks) {
      results.multiFaceLandmarks.forEach((landmarks) => {
        // 目、鼻、口、耳周りのポイントの座標を取得
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const noseTip = landmarks[1];
        const leftMouth = landmarks[61];
        const rightMouth = landmarks[291];
        const leftEar = landmarks[234];
        const rightEar = landmarks[454];
        const rightEyeTop = landmarks[386];
        const rightEyeBottom = landmarks[374];
        const leftEyeTop = landmarks[159];
        const leftEyeBottom = landmarks[145];
        const topMouth = landmarks[13];
        const bottomMouth = landmarks[14];

        const roll =
          (Math.atan2(leftEye.y - rightEye.y, leftEye.x - rightEye.x) * 180) /
          Math.PI;
        const base = Math.hypot(leftEye.x - rightEye.x, leftEye.y - rightEye.y);
        const mouthOpen = Math.hypot(
          topMouth.x - bottomMouth.x,
          topMouth.y - bottomMouth.y
        );

        const mouthWide = Math.hypot(
          leftMouth.x - rightMouth.x,
          leftMouth.y - rightMouth.y
        );

        const leftEyeOpen = Math.hypot(
          leftEyeTop.x - leftEyeBottom.x,
          leftEyeTop.y - leftEyeBottom.y
        );

        const rightEyeOpen = Math.hypot(
          rightEyeTop.x - rightEyeBottom.x,
          rightEyeTop.y - rightEyeBottom.y
        );

        const earCenter = {
          x: (leftEar.x + rightEar.x) * 0.5,
          y: (leftEar.y + rightEar.y) * 0.5,
        };

        const eyeCenter = {
          x: (leftEye.x + rightEye.x) * 0.5,
          y: (leftEye.y + rightEye.y) * 0.5,
        };

        const faceCenter = {
          x: (eyeCenter.x + noseTip.x) * 0.5,
          y: (eyeCenter.y + noseTip.y) * 0.5,
        };

        const feeling =
          (leftMouth.y + rightMouth.y) * 0.5 -
          (topMouth.y + bottomMouth.y) * 0.5;
        //console.log(map(feeling / base, 0, -0.15, 0, 1));

        setFace({
          roll: 180 - roll,
          yaw: (earCenter.x - noseTip.x) / ((rightEar.x - leftEar.x) * 0.5),
          pitch:
            (earCenter.y - faceCenter.y) / ((noseTip.y - eyeCenter.y) * 0.5),
          mouthOpen: map(mouthOpen / base, 0, 0.8, 0, 1),
          mouthWide: map(mouthWide / base, 0.4, 0.8, 0, 1),
          leftEyeOpen: leftEyeOpen / base < 0.08 ? 0.2 : 1,
          rightEyeOpen: rightEyeOpen / base < 0.08 ? 0.2 : 1,
          feeling: map(feeling / base, 0.05, -0.15, 0, 1),
        });
      });
    }
    const ctx = canvasRef.current.getContext("2d");
    draw(ctx, results, true, { min: 0, max: 477, step: 1, value: 0 });
  }, []);

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true, // landmarks 468 -> 478
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    if (webcamRef.current) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await faceMesh.send({ image: webcamRef.current.video });
        },
        width: 320,
        height: 180,
      });
      camera.start();
    }

    return () => {
      faceMesh.close();
    };
  }, [onResults]);

  const loop = useCallback(() => {
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const volumeLevel = Math.max(...dataArray) / 255;
    setMic(volumeLevel);
    //if (callback) callback(volumeLevel);
    requestRef.current = requestAnimationFrame(loop);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: 144,
        //scale: `${280 / 320}`,
        transformOrigin: "left top",
      }}
    >
      <Webcam
        ref={webcamRef}
        style={{ display: "none" }}
        audio={true}
        width={256}
        height={144}
        mirrored
        screenshotFormat="image/jpeg"
        videoConstraints={{ width: 256, height: 144, facingMode: "user" }}
        onUserMedia={(stream) => {
          console.log(stream);
          audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 2048;
          analyserRef.current.smoothingTimeConstant = 0.8;
          const source =
            audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          loop();
        }}
      />
      {/* draw */}
      <canvas
        ref={canvasRef}
        width={256}
        height={144}
        style={{ scale: "-1 1" }}
      />
      <Avatar />
      <MyLabel />
      <MySpeaking />
    </div>
  );
}

function MyLabel() {
  const name = useStore((state) => state.name);

  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        top: 16,
        background: "rgba(0,0,0,0.5)",
        padding: "4px 8px",
        borderRadius: 4,
      }}
    >
      {name}
    </div>
  );
}

function MySpeaking() {
  const speaking = useStore((state) => state.speaking);

  return (
    speaking !== "" && (
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 48,
          background: "white",
          color: "black",
          padding: "4px 8px",
          borderRadius: "24px 24px 24px 0",
        }}
      >
        {speaking}
      </div>
    )
  );
}

function Avatar() {
  const face = useStore((state) => state.face);
  const mic = useStore((state) => state.mic);
  const myId = useMyId();

  //console.log(face);
  return (
    <Emoticon
      {...face}
      style={{
        position: "absolute",
        left: 16,
        bottom: 16,
        width: 64,
        height: 64,
        borderRadius: "50%",
        outlineStyle: "solid",
        outlineOffset: 2,
        outlineWidth: map(mic, 0.15, 1, 2, 10),
        outlineColor: colors[myId % colors.length],
      }}
    />
  );
}
