import { styled } from "@stitches/react";
import IconButton from "./IconButton";
import {
  mdiCursorDefaultOutline,
  mdiCompassOutline,
  mdiEmoticonHappyOutline,
} from "@mdi/js";

const Container = styled("div", {
  position: "absolute",
  top: 24,
  right: 24,
  display: "flex",
  gap: 16,
});

export default function Functions() {
  return (
    <Container>
      <IconButton icon={mdiCompassOutline} />
      <IconButton icon={mdiEmoticonHappyOutline} />
    </Container>
  );
}
