import { styled } from "@stitches/react";
import * as Slider from "@radix-ui/react-slider";
import { getTime } from "../utils/math";
import useInterval from "../hooks/useInterval";
import useIdle from "../hooks/useIdle";

import Icon from "./Icon";
import IconButton from "./IconButton";
import {
  mdiPlay,
  mdiPause,
  mdiFastForward10,
  mdiRewind10,
  mdiCircleMedium,
  mdiArrowRightThin,
} from "@mdi/js";
import { useState } from "react";
import { useControls } from "leva";

const Container = styled("div", {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5))",
  height: 240,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  transition: "opacity 0.5s",
  variants: {
    inactive: {
      true: {
        opacity: 0,
        pointerEvent: "none",
      },
    },
  },
});

const Controls = styled("div", {
  display: "flex",
  alignItems: "center",
  height: 64,
  gap: 4,
  padding: "0 16px",
});

const LiveButton = styled("div", {
  display: "flex",
  alignItems: "center",
  color: "white",
  height: 48,
  padding: "0 12px",
  borderRadius: 4,
  variants: {
    live: {
      true: {
        color: "red",
      },
      false: {
        "&:hover": {
          background: "rgba(255, 255, 255, 0.1)",
          cursor: "pointer",
        },
      },
    },
  },
});

const SliderRoot = styled(Slider.Root, {
  position: "relative",
  display: "flex",
  alignItems: "center",
  userSelect: "none",
  touchAction: "none",
  width: "100%",
  //height: 20,
});

const SliderTrack = styled(Slider.Track, {
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  position: "relative",
  flexGrow: 1,
  borderRadius: "9999px",
  height: 3,
});

const SliderRange = styled(Slider.Range, {
  position: "absolute",
  backgroundColor: "white",
  borderRadius: "9999px",
  height: "100%",
  variants: {
    live: {
      true: {
        backgroundColor: "red",
      },
    },
  },
});

const SliderThumb = styled(Slider.Thumb, {
  display: "block",
  width: 20,
  height: 20,
  backgroundColor: "white",
  borderRadius: 10,
  //'&:hover': { backgroundColor: violet.violet3 },
  //'&:focus': { outline: 'none', boxShadow: `0 0 0 5px ${blackA.blackA8}` },
});

export default function PlayerControl() {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(1);
  /*
  const { live } = useControls({
    live: true,
  });
  */
  const [elapsed, setElapsed] = useState(10 * 60);
  useInterval(() => setElapsed((t) => t + 1), 1000);
  const live = progress > 0.99 && playing;
  const isIdle = useIdle(3000);

  return (
    <Container inactive={isIdle}>
      {!live && <div style={{ padding: 16 }}>再生速度: 1x</div>}
      <SliderRoot
        defaultValue={[1]}
        max={1}
        step={0.001}
        value={[progress]}
        onValueChange={([val]) => {
          setProgress(val);
        }}
      >
        <SliderTrack>
          <SliderRange live={live} />
        </SliderTrack>
        <SliderThumb />
      </SliderRoot>
      <Controls>
        <IconButton icon={mdiRewind10} />
        <IconButton
          icon={playing ? mdiPause : mdiPlay}
          onClick={() => {
            setPlaying((b) => !b);
          }}
        />
        <IconButton icon={mdiFastForward10} disabled={live} />
        <LiveButton
          live={live}
          onClick={() => {
            setProgress(1);
            setPlaying(true);
          }}
        >
          <Icon path={live ? mdiCircleMedium : mdiArrowRightThin} size={1} />
          LIVE
        </LiveButton>
        <div>
          {!live && `${getTime(elapsed * progress)} / `}
          <span style={{ color: "red" }}>{getTime(elapsed)}</span>
        </div>
      </Controls>
    </Container>
  );
}
