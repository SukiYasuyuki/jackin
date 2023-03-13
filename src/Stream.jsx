import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const MuxVideoPlayer = ({ muxPlaybackId }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      hlsRef.current = new Hls();
      hlsRef.current.loadSource(
        `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`
      );
      hlsRef.current.attachMedia(videoRef.current);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [muxPlaybackId]);

  return <video ref={videoRef} controls />;
};

export default MuxVideoPlayer;

/*
import { useEffect, useRef } from "react";
import Hls from "hls.js";

function VideoPlayer({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.controls = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // This will run in safari, where HLS is supported natively
      video.src = src;
    } else if (Hls.isSupported()) {
      // This will run in all other modern browsers
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      console.error(
        "This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API"
      );
    }
  }, [src, videoRef]);

  return (
    <>
      <video ref={videoRef} style={{ maxWidth: "100%" }} />
    </>
  );
}

export default function App() {
  return (
    <div>
      <VideoPlayer src="https://stream.mux.com/kjjwiBv02zMXxyTZApGrwqKrhapq3KNIorZbZtX01QYTU.m3u8" />
    </div>
  );
}
*/
