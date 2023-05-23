import { styled } from "@stitches/react";
import IconButton from "./IconButton";
import {
  mdiCursorDefaultOutline,
  mdiCompassOutline,
  mdiEmoticonHappyOutline,
  mdiCog,
} from "@mdi/js";
import * as Popover from "@radix-ui/react-popover";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import useStore from "../store";
import { menuItems } from "../Pie";
import useInterval from "../hooks/useInterval";
import useMyId from "../hooks/useMyId";

const Container = styled("div", {
  position: "absolute",
  top: 24,
  right: 24,
  display: "flex",
  gap: 16,
});

const Section = styled("section", {
  marginBottom: 32,
});

const SectionHeader = styled("div", {
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 16,
  color: "rgba(255, 255, 255, 0.6)",
});

const Image = styled("div", {
  border: "1px solid gray",
  aspectRatio: "16 / 9",
  marginBottom: 4,
  cursor: "pointer",
  variants: {
    selected: {
      true: {
        border: "2px solid white",
        //outlineOffset: 2,
      },
    },
  },
});

const Label = styled("div", {
  fontSize: 12,
  textAlign: "center",
});

function Tile({ label, selected, ...props }) {
  return (
    <div {...props}>
      <Image selected={selected}></Image>
      <Label>{label}</Label>
    </div>
  );
}

const Grid = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
});

function Settings() {
  /*
  const edge = useStore((state) => state.edge);
  const setEdge = useStore((state) => state.setEdge);
  */
  const displayType = useStore((state) => state.displayType);
  const setDisplayType = useStore((state) => state.setDisplayType);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton icon={mdiCog} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={16}
          style={{
            width: 100,
            borderRadius: 4,
            padding: 20,
            width: 216,
            backgroundColor: "rgba(0,0,0, 0.4)",
            backdropFilter: "blur(40px)",
          }}
        >
          <Section>
            <SectionHeader>表示タイプ</SectionHeader>
            <Grid>
              <Tile
                label={"Side Bar"}
                selected={displayType === "sidebar"}
                onClick={() => setDisplayType("sidebar")}
              />
              <Tile
                label={"Surround"}
                selected={displayType === "surround"}
                onClick={() => setDisplayType("surround")}
              />
              <Tile
                label={"Sphere1"}
                selected={displayType === "sphere"}
                onClick={() =>
                  displayType !== "sphere" && setDisplayType("sphere")
                }
              />
              <Tile
                label={"Sphere2"}
                selected={displayType === "sphere2"}
                onClick={() => setDisplayType("sphere2")}
              />
              <Tile label={"Observatory"} />
              <Tile label={"Compass"} />
            </Grid>
          </Section>
          {/* <Section>
            <SectionHeader>レイアウト</SectionHeader>
            <Grid>
              <Tile label={"フローティング"} selected />
              <Tile label={"スプリット"} />
            </Grid>
          </Section>
          <Section>
            <SectionHeader>表示オプション</SectionHeader>
            <Grid>
              <Tile label={"他者のカーソル"} selected />
              <Tile label={"他者の視野"} />
            </Grid>
        </Section> */}
          <button>退出する</button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default function Functions() {
  const myId = useMyId();
  const addReaction = useStore((state) => state.addReaction);
  const updateReactions = useStore((state) => state.updateReactions);

  useInterval(updateReactions, 1000);
  return (
    <Container>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <IconButton icon={mdiEmoticonHappyOutline} />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <Content sideOffset={5} align="end">
            {menuItems.map(({ label }, i) => (
              <Item key={i} onSelect={() => addReaction(label, myId)}>
                {label}
              </Item>
            ))}
          </Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <Settings />
    </Container>
  );
}

const Content = styled(DropdownMenu.Content, {
  backgroundColor: "rgba(0,0,0, 0.4)",
  backdropFilter: "blur(40px)",
  display: "flex",
  borderRadius: 12,
});

const Item = styled(DropdownMenu.Item, {
  width: 56,
  height: 56,
  fontSize: 32,
  display: "grid",
  placeContent: "center",
  cursor: "pointer",
});
