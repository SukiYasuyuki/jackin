import React, { FC, useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { button, useControls } from "leva";

import { Camera as _Camera } from "@mediapipe/camera_utils/camera_utils";
import { FaceMesh as _FaceMesh } from "@mediapipe/face_mesh/face_mesh";
import { draw } from "./utils/drawCanvas";
import Emoticon from "./components/Emoticon";
import useStore from "./store";

const FaceMesh = _FaceMesh || window.FaceMesh;
const Camera = _Camera || window.Camera;

function calculateQuaternion(vector1, vector2) {
  // 正規化
  vector1 = vector1.map(
    (p) => p / Math.sqrt(vector1.reduce((sum, v) => sum + v ** 2, 0))
  );
  vector2 = vector2.map(
    (p) => p / Math.sqrt(vector2.reduce((sum, v) => sum + v ** 2, 0))
  );

  // 回転軸を計算
  const axis = [
    vector1[1] * vector2[2] - vector1[2] * vector2[1],
    vector1[2] * vector2[0] - vector1[0] * vector2[2],
    vector1[0] * vector2[1] - vector1[1] * vector2[0],
  ];

  // 回転角度を計算
  const angle = Math.acos(
    vector1[0] * vector2[0] + vector1[1] * vector2[1] + vector1[2] * vector2[2]
  );

  // クォータニオンを計算
  const s = Math.sin(angle / 2);
  const w = Math.cos(angle / 2);
  const x = axis[0] * s;
  const y = axis[1] * s;
  const z = axis[2] * s;

  return [w, x, y, z];
}

function multiplyQuaternions(q1, q2) {
  const w1 = q1[0],
    x1 = q1[1],
    y1 = q1[2],
    z1 = q1[3];
  const w2 = q2[0],
    x2 = q2[1],
    y2 = q2[2],
    z2 = q2[3];
  const w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
  const x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
  const y = w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2;
  const z = w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2;
  return [w, x, y, z];
}

function calculateEulerAngle(points3D) {
  // 中心を求める
  const center = [
    points3D.reduce((sum, p) => sum + p[0], 0) / points3D.length,
    points3D.reduce((sum, p) => sum + p[1], 0) / points3D.length,
    points3D.reduce((sum, p) => sum + p[2], 0) / points3D.length,
  ];

  // 座標系の回転
  const rotatedPoints = points3D.map((p) => {
    const [x, y, z] = p;
    const dx = x - center[0];
    const dy = y - center[1];
    const dz = z - center[2];
    return [dz, -dx, -dy];
  });

  // クォータニオンを計算
  const q1 = calculateQuaternion(rotatedPoints[0], rotatedPoints[1]);
  const q2 = calculateQuaternion(rotatedPoints[0], rotatedPoints[2]);
  const q3 = calculateQuaternion(rotatedPoints[0], rotatedPoints[3]);
  const q4 = calculateQuaternion(rotatedPoints[0], rotatedPoints[4]);
  const q5 = calculateQuaternion(rotatedPoints[5], rotatedPoints[6]);
  const q = multiplyQuaternions(
    multiplyQuaternions(
      multiplyQuaternions(multiplyQuaternions(q1, q2), q3),
      q4
    ),
    q5
  );

  // クォータニオンからオイラー角を算出
  const yaw =
    (Math.atan2(
      2 * (q[0] * q[3] + q[1] * q[2]),
      1 - 2 * (q[2] ** 2 + q[3] ** 2)
    ) *
      180) /
    Math.PI;
  const pitch = (Math.asin(2 * (q[0] * q[2] - q[3] * q[1])) * 180) / Math.PI;
  const roll =
    (Math.atan2(
      2 * (q[0] * q[1] + q[2] * q[3]),
      1 - 2 * (q[1] ** 2 + q[2] ** 2)
    ) *
      180) /
    Math.PI;

  return [yaw, pitch, roll];
}

export default function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const resultsRef = useRef();
  const setFace = useStore((state) => state.setFace);

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

        //console.log(leftEye);

        // 各ポイントの3次元座標を計算
        const points3D = [
          [leftEye.x, leftEye.y, leftEye.z],
          [rightEye.x, rightEye.y, rightEye.z],
          [noseTip.x, noseTip.y, noseTip.z],
          [leftMouth.x, leftMouth.y, leftMouth.z],
          [rightMouth.x, rightMouth.y, rightMouth.z],
          [leftEar.x, leftEar.y, leftEar.z],
          [rightEar.x, rightEar.y, rightEar.z],
        ];

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
        //console.log(mouthOpen / base);
        //console.log(180 - rotation);

        setFace({ roll: 180 - roll, mouthOpen: mouthOpen / base });

        // クォータニオンを計算してオイラー角を算出
        //const [yaw, pitch, roll] = calculateEulerAngle(points3D);
        //console.log(yaw, pitch, roll);
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

  return (
    <div
      style={{
        position: "relative",
        scale: `${280 / 320}`,
        transformOrigin: "left top",
      }}
    >
      <Webcam
        ref={webcamRef}
        style={{ display: "none" }}
        audio={false}
        width={320}
        height={180}
        mirrored
        screenshotFormat="image/jpeg"
        videoConstraints={{ width: 320, height: 180, facingMode: "user" }}
      />
      {/* draw */}
      <canvas
        ref={canvasRef}
        width={320}
        height={180}
        style={{ scale: "-1 1" }}
      />
      <Avatar />
      <MyLabel />
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

function Avatar() {
  const face = useStore((state) => state.face);
  //console.log(face);
  return (
    <Emoticon
      {...face}
      style={{ position: "absolute", left: 16, bottom: 16 }}
    />
  );
}
