import { create } from "zustand";

export const useGameStore = create((set) => ({
  xp: 0,
  level: 0,
  storyId: null,
  updateProgress: ({ xp, level }) => set({ xp, level }),
  setStoryId: (storyId) => set({ storyId }),
  resetStory: () => set({ storyId: null }),
}));
