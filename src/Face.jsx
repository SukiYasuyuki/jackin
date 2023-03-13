import React, { FC, useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { button, useControls } from "leva";

import { Camera } from "@mediapipe/camera_utils";
import {
  FaceMesh,
  FACEMESH_LEFT_EYE,
  FACEMESH_LIPS,
  FACEMESH_RIGHT_EYE,
  Results,
} from "@mediapipe/face_mesh";
import { draw } from "./utils/drawCanvas";

export default function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const resultsRef = useRef();

  const onResults = useCallback((results) => {
    resultsRef.current = results;
    //console.log(results);

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
        width: 1280,
        height: 720,
      });
      camera.start();
    }

    return () => {
      faceMesh.close();
    };
  }, [onResults]);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        //style={{ visibility: 'hidden' }}
        audio={false}
        width={1280}
        height={720}
        mirrored
        screenshotFormat="image/jpeg"
        videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
      />
      {/* draw */}
      <canvas ref={canvasRef} width={1280} height={720} />
    </div>
  );
}
