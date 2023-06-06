import { create } from "zustand";
import { createClient } from "@liveblocks/client";
import { liveblocks } from "@liveblocks/zustand";

const client = createClient({
  publicApiKey: "pk_test_KGSl5DlvcMuueaU8lavLFrtk",
  //throttle: 16,
});

const { max, min } = Math;

const useStore = create()(
  liveblocks(
    (set) => ({
      cursor: { x: 0, y: 0 },
      angle: { azimuth: 0, polaris: Math.PI / 2 },
      face: {
        roll: 0,
        leftEyeOpen: 1,
        rightEyeOpen: 1,
        mouthOpen: 1,
        mouthWide: 1,
      },
      edge: false,
      displayType: "sphere",
      setDisplayType: (displayType) => set({ displayType }),
      speaking: "",
      setSpeaking: (speaking) => set({ speaking }),
      setEdge: (edge) => set({ edge }),
      setFace: (face) => set({ face }),
      setAngle: (angle) => set({ angle }),
      comments: {},
      addComment: (comment) =>
        set((state) => ({
          comments: { ...state.comments, [Date.now().toString()]: comment },
        })),
      clearComments: () => set({ comments: {} }),
      setCursor: (cursor) => set({ cursor }),
      sync: null,
      setSync: (sync) => set({ sync }),
      selected: null,
      setSelected: (selected) => set({ selected }),

      controlEnabled: true,
      setControlEnabled: (controlEnabled) => set({ controlEnabled }),
      mic: 0,
      name: "",
      setName: (name) => set({ name }),
      setMic: (mic) => set({ mic }),

      flags: [],
      addFlag: (point, userId) =>
        set((state) => ({
          flags: [
            ...state.flags,
            {
              id: Date.now().toString(),
              userId,
              point,
            },
          ],
        })),
      clearFlag: (id) =>
        set((state) => ({
          flags: state.flags.filter((flag) => flag.id !== id),
        })),
      clearFlags: () => set({ flags: [] }),

      reactions: [],
      attention: false,
      setAttention: (attention) => set({ attention }),
      fov: 60,
      addFov: (val) =>
        set((state) => ({ fov: min(max(state.fov + val, 30), 120) })),
      addReaction: (reaction, id) =>
        set((state) => ({
          reactions: [
            ...state.reactions,
            {
              value: reaction,
              id,
              timestamp: Date.now(),
              point: { x: state.cursor.x, y: state.cursor.y },
            },
          ],
        })),
      updateReactions: () =>
        set((state) => ({
          reactions: state.reactions.filter(
            (reaction) => reaction.timestamp > Date.now() - 4000
          ),
        })),
      mouse: { x: 0, y: 0 },
      setMouse: (mouse) => set({ mouse }),
      dragging: false,
      setDragging: (dragging) => set({ dragging }),
      inner: 50,
      setInner: (inner) => set({ inner }),
      size: 2,
      setSize: (size) => set({ size }),
      stepback: false,
      setStepback: (stepback) => set({ stepback }),
      toggleStepback: () => set((state) => ({ stepback: !state.stepback })),
      pieMenuOpen: null,
      setPieMenuOpen: (pieMenuOpen) => set({ pieMenuOpen }),
      playing: false,
      play: () => set({ playing: true }),
      pause: () => set({ playing: false }),
    }),
    {
      client,
      presenceMapping: {
        cursor: true,
        angle: true,
        mic: true,
        name: true,
        face: true,
        fov: true,
        attention: true,
      },
      storageMapping: {
        //sync: true,
        comments: true,
        reactions: true,
        flags: true,
        playing: true,
      },
    }
  )
);

export default useStore;
