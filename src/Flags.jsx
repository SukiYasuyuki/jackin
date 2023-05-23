import { Sphere, Line } from "@react-three/drei";
import useStore from "./store";
import colors from "./utils/colors";
import { Fragment } from "react";
import { useControls, button } from "leva";

const { sin, cos, PI } = Math;

function latlng2xyz(lat, lng, radius) {
  const longitude = (-lng * PI) / 180;
  const latitude = (lat * PI) / 180;
  const y = radius * sin(latitude);
  const x = radius * cos(longitude) * cos(latitude);
  const z = radius * sin(longitude) * cos(latitude);
  return [x, y, z];
}

export default function Flags() {
  const flags = useStore((state) => state.flags);
  const clearFlags = useStore((state) => state.clearFlags);
  const clearFlag = useStore((state) => state.clearFlag);
  //console.log(flags);

  useControls({
    "clear flag": button(clearFlags),
  });
  return (
    flags.length > 0 &&
    flags.map(({ userId, point, id }, i) => {
      const targetPoint = latlng2xyz(point.azimuth, point.polaris, 500);
      let pinPoint = latlng2xyz(point.azimuth, point.polaris, 400);
      pinPoint[1] += 10;
      return (
        <Fragment key={id}>
          <Line points={[targetPoint, pinPoint]} color={"#fff"} lineWidth={2} />

          <Line points={[targetPoint, pinPoint]} color={"#ddd"} />
          <Sphere
            position={pinPoint}
            args={[3]}
            onDoubleClick={(e) => {
              e.stopPropagation();
              clearFlag(id);
            }}
          >
            <meshBasicMaterial
              color={colors[userId % colors.length]}
              toneMapped={false}
            />
          </Sphere>

          <Sphere position={targetPoint} args={[1]}>
            <meshBasicMaterial
              color={colors[userId % colors.length]}
              toneMapped={false}
            />
          </Sphere>
        </Fragment>
      );
    })
  );
  //flags.length > 0 && flags.map
}
