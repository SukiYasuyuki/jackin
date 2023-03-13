import { useEffect, useRef } from "react";

export default function useMic(callback) {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    // マイク入力を取得する
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        // AudioContextを作成する
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        // 分析オブジェクトを作成する
        analyserRef.current = audioContextRef.current.createAnalyser();
        // 分析オブジェクトの設定をする
        analyserRef.current.fftSize = 2048;
        analyserRef.current.smoothingTimeConstant = 0.8;
        // マイクからの入力を取得する
        const source = audioContextRef.current.createMediaStreamSource(stream);
        // 分析オブジェクトに接続する
        source.connect(analyserRef.current);
        // アニメーションを開始する
        draw();
      })
      .catch((error) => console.error(error));
  }, []);

  const draw = () => {
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    // ボリュームレベルを計算する
    const volumeLevel = Math.max(...dataArray) / 255;
    if (callback) callback(volumeLevel);
    requestRef.current = requestAnimationFrame(draw);
  };
  return null;
}
