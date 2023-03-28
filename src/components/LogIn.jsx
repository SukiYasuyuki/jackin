import { useState } from "react";
import { styled } from "@stitches/react";
import useStore from "../store";

const Container = styled("div", {
  width: "100vw",
  height: "100vh",
  display: "grid",
  placeContent: "center",
});

const Wizard = styled("div", {
  width: "400px",
  height: "400px",
  background: "#111",
  borderRadius: 16,
  padding: 32,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: 24,
});

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: 16,
  flex: 1,
});

const Section = styled("section", {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: 8,
});

const Input = styled("input", {
  //all: "unset",
  height: 48,
  borderRadius: 6,
  fontSize: 16,
  border: "none",
  background: "rgba(255, 255, 255, 0.1)",
  padding: "0 16px",
});

const Title = styled("h1", {
  marginBlock: 0,
});

export default function LogIn() {
  const [name, set] = useState("");
  const [id, setId] = useState("");
  const setName = useStore((state) => state.setName);

  return (
    <Container>
      <Wizard>
        <Title>JackIn...</Title>
        <div>3人のゴーストが参加中</div>
        <Form
          onSubmit={(e) => {
            setName(name);
            e.preventDefault();
          }}
        >
          <Section>
            <label>あなたの名前</label>
            <Input
              type="text"
              value={name}
              placeholder={"表示される名前"}
              onChange={(e) => set(e.target.value)}
            />
          </Section>
          <Section>
            <label>合言葉 (Optional)</label>
            <Input
              type="text"
              value={id}
              placeholder={"知人のみのグループで参加する場合に設定します"}
              onChange={(e) => setId(e.target.value)}
            />
          </Section>
          <div style={{ flex: 1 }} />
          <Input
            disabled={!name}
            type="submit"
            value="参加する"
            css={{ cursor: "pointer" }}
          />
        </Form>
      </Wizard>
    </Container>
  );
}
