import { create } from "zustand";

type WatchlistState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  ids: [],
  toggle: (id) =>
    set((state) => ({
      ids: state.ids.includes(id)
        ? state.ids.filter((x) => x !== id)
        : [...state.ids, id],
    })),
  has: (id) => get().ids.includes(id),
}));
