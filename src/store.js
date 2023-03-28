import { create } from "zustand";
import { createClient } from "@liveblocks/client";
import { liveblocks } from "@liveblocks/zustand";

const client = createClient({
  publicApiKey: "pk_test_KGSl5DlvcMuueaU8lavLFrtk",
});

const useStore = create()(
  liveblocks(
    (set) => ({
      cursor: { x: 0, y: 0 },
      angle: { azimuth: 0, polaris: 0 },
      face: {
        roll: 0,
        leftEyeOpen: 1,
        rightEyeOpen: 1,
        mouthOpen: 1,
        mouthWide: 1,
      },
      edge: false,
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
      reactions: [],
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
    }),
    {
      client,
      presenceMapping: {
        cursor: true,
        angle: true,
        mic: true,
        name: true,
        face: true,
      },
      storageMapping: {
        //sync: true,
        comments: true,
        reactions: true,
      },
    }
  )
);

export default useStore;
