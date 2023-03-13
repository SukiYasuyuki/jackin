import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {
  FACEMESH_FACE_OVAL,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_LEFT_IRIS,
  FACEMESH_LIPS,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_TESSELATION,
  NormalizedLandmark,
  Results,
} from "@mediapipe/face_mesh";
import {
  HAND_CONNECTIONS,
  NormalizedLandmarkListList,
  //Results,
} from "@mediapipe/hands";

/**
 * canvasに描画する
 * @param ctx コンテキスト
 * @param results 検出結果
 * @param bgImage capture imageを描画するか
 * @param emphasis 強調するlandmarkのindex
 */
export const draw = (ctx, results, bgImage, emphasis) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  if (bgImage) ctx.drawImage(results.image, 0, 0, width, height);

  if (results.multiFaceLandmarks) {
    const lineWidth = 1;
    const tesselation = { color: "#C0C0C070", lineWidth };
    const right_eye = { color: "#FF3030", lineWidth };
    const left_eye = { color: "#30FF30", lineWidth };
    const face_oval = { color: "#E0E0E0", lineWidth };

    for (const landmarks of results.multiFaceLandmarks) {
      // 顔の表面（埋め尽くし）
      drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, tesselation);
      // 右の目・眉・瞳
      drawConnectors(ctx, landmarks, FACEMESH_RIGHT_EYE, right_eye);
      drawConnectors(ctx, landmarks, FACEMESH_RIGHT_EYEBROW, right_eye);
      drawConnectors(ctx, landmarks, FACEMESH_RIGHT_IRIS, right_eye);
      // 左の目・眉・瞳
      drawConnectors(ctx, landmarks, FACEMESH_LEFT_EYE, left_eye);
      drawConnectors(ctx, landmarks, FACEMESH_LEFT_EYEBROW, left_eye);
      drawConnectors(ctx, landmarks, FACEMESH_LEFT_IRIS, left_eye);
      // 顔の輪郭
      drawConnectors(ctx, landmarks, FACEMESH_FACE_OVAL, face_oval);
      // 唇
      drawConnectors(ctx, landmarks, FACEMESH_LIPS, face_oval);

      // landmarkの強調描画
      console.log(landmarks);
      //drawPoint(ctx, landmarks[emphasis]);
    }
  }
  ctx.restore();
};

/**
 * 特定のlandmarkを強調する
 * @param ctx
 * @param point
 */
const drawPoint = (ctx, point) => {
  //console.log(point);
  const x = ctx.canvas.width * point.x;
  const y = ctx.canvas.height * point.y;
  const r = 5;

  ctx.fillStyle = "#22a7f2";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.fill();
};

export const drawCanvas = (ctx, results) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  // canvas の左右反転
  ctx.scale(-1, 1);
  ctx.translate(-width, 0);
  // capture image の描画
  ctx.drawImage(results.image, 0, 0, width, height);
  // 手の描画
  if (results.multiHandLandmarks) {
    // 骨格の描画
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 1,
      });
      drawLandmarks(ctx, landmarks, {
        color: "#FF0000",
        lineWidth: 1,
        radius: 2,
      });
    }
    // 円の描画
    drawCircle(ctx, results.multiHandLandmarks);
  }
  ctx.restore();
};

/**
 *  人差し指の先端と人差し指の先端の間に円を描く
 * @param ctx
 * @param handLandmarks
 */
const drawCircle = (ctx, handLandmarks) => {
  if (
    handLandmarks.length === 2 &&
    handLandmarks[0].length > 8 &&
    handLandmarks[1].length > 8
  ) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const [x1, y1] = [
      handLandmarks[0][8].x * width,
      handLandmarks[0][8].y * height,
    ];
    const [x2, y2] = [
      handLandmarks[1][8].x * width,
      handLandmarks[1][8].y * height,
    ];
    const x = (x1 + x2) / 2;
    const y = (y1 + y2) / 2;
    const r = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) / 2;

    ctx.strokeStyle = "#0082cf";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.stroke();
  }
};
