import { Html, OrthographicCamera, Hud, Environment } from "@react-three/drei";
import { Model as Head } from "../Head";
import { styled } from "@stitches/react";
import useStore from "../store";
import colors from "../utils/colors";
import { useThree } from "@react-three/fiber";
import useMyId from "../hooks/useMyId";
import { map } from "../utils/math";

export default function Dock() {
  const { width, height } = useThree((state) => state.viewport);
  const size = useThree((state) => state.size);
  const displayType = useStore((state) => state.displayType);

  //console.log(width, height, size);

  const others = useStore((state) => state.liveblocks.others);
  const angle = useStore((state) => state.angle);
  const name = useStore((state) => state.name);
  const mic = useStore((state) => state.mic);
  const myId = useMyId();
  const reactions = useStore((state) => state.reactions);
  const reaction = reactions.findLast((r) => r.id === myId);
  const comments = useStore((state) => state.comments);
  const comment = Object.entries(comments).findLast(
    ([_, { to, from }]) => myId === from
  );

  return (
    displayType === "observatory" && (
      <Hud renderPriority={1}>
        <Environment preset="city"></Environment>

        <OrthographicCamera position={[0, 0, 100]} makeDefault zoom={1} />
        <group
          //ref={mesh}
          position={[0, -size.height / 2 + 150, 0]}
        >
          <group scale={50}>
            <Head
              color={colors[myId % colors.length]}
              //scale={0.4}
              scale={map(mic, 0.15, 1, 0.4, 0.5)}
              rotation={[Math.PI / 12, 0, 0]}
              rotation-order="YXZ"
              position-y={map(mic, 0.15, 1, 0, 0.1)}
            >
              <Html center>
                <Name style={{ color: colors[myId % colors.length] }}>
                  {name}
                </Name>
                {comment && <Comment>{comment[1].text}</Comment>}
                {reaction && (
                  <div
                    style={{
                      fontSize: 48,
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  >
                    {reaction.value}
                  </div>
                )}
              </Html>
            </Head>
            {others.map(({ presence, connectionId, name }, i) => {
              const x = (Math.floor(i / 2) + 1) * (i % 2 ? 1 : -1) * 2.5;
              const color = colors[connectionId % colors.length];
              const rx = presence.angle.polaris - angle.polaris;
              const ry = presence.angle.azimuth - angle.azimuth;
              const reaction = reactions.findLast((r) => r.id === connectionId);
              const comment = Object.entries(comments).findLast(
                ([_, { to, from }]) => connectionId === from
              );
              return (
                <Head
                  //scale={0.4}
                  scale={map(presence.mic, 0.15, 1, 0.4, 0.5)}
                  color={color}
                  position-x={x}
                  position-y={map(presence.mic, 0.15, 1, 0, 0.1)}
                  key={connectionId}
                  rotation-order="YXZ"
                  rotation={[rx + Math.PI / 12, ry, 0]}
                >
                  <Html center>
                    <Name style={{ color }}>{presence.name}</Name>
                    {comment && <Comment>{comment[1].text}</Comment>}
                    {reaction && (
                      <div
                        style={{
                          fontSize: 48,
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                      >
                        {reaction.value}
                      </div>
                    )}
                  </Html>
                </Head>
              );
            })}
            {/* <Plane args={[10]} rotation-x={-Math.PI / 2 + 0.01}>
              <meshStandardMaterial color={"white"} />
          </Plane> */}
          </group>
        </group>
      </Hud>
    )
  );
}

const Name = styled("div", {
  color: "white",
  borderRadius: "999px",
  fontSize: 12,
  height: "20px",
  lineHeight: "20px",
  //bottom: "-12px",
  padding: "0 6px",
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(20px)",
  whiteSpace: "nowrap",
  marginTop: 80,
});

const Comment = styled("div", {
  position: "absolute",
  color: "black",
  background: "white",
  borderRadius: "999px",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  maxWidth: 100,
  fontSize: 14,
  //height: "20px",
  lineHeight: "20px",
  top: "-10px",
  left: 10,
  padding: "4px 12px",
  translate: "-50% 0",
});
