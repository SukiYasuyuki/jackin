import useStore from "../store";

export default function useMyId() {
  let id;
  const room = useStore((state) => state.liveblocks.room);
  if (room) {
    const self = room.getSelf();
    if (self) {
      id = self.connectionId;
    }
  }
  return id;
}
