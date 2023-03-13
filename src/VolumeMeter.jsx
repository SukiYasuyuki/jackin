import React, { useRef, useEffect } from "react";

const VolumeMeter = () => {
  const canvasRef = useRef(null);
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
    // キャンバスを取得する
    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext("2d");
    // キャンバスの幅と高さを取得する
    const width = canvas.width;
    const height = canvas.height;
    // 分析オブジェクトから周波数データを取得する
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    // ボリュームレベルを計算する
    const volumeLevel = Math.max(...dataArray) / 255;
    console.log(volumeLevel);
    // キャンバスをクリアする
    canvasContext.clearRect(0, 0, width, height);
    // ボリュームメーターを描画する
    canvasContext.fillStyle = "#f00";
    canvasContext.fillRect(0, 0, volumeLevel * width, height);
    // アニメーションを再開する
    requestRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    return () => {
      // アニメーションを停止する
      cancelAnimationFrame(requestRef.current);
      // AudioContextを解放する
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return <canvas ref={canvasRef} width={200} height={50} />;
};

export default VolumeMeter;
