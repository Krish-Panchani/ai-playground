export const ADVENTURE_WORLDS = [
  "Forest of Beginnings",
  "Crystal Caves",
  "Ancient Ruins",
  "Sky Realm",
  "Dragon Peak",
];

export const MISSION_FALLBACKS = [
  { chapterTitle: "Forest Gateway", missionPrompt: "Draw a magical tree with glowing roots and tiny fireflies.", missionTheme: "Enchanted Forest" },
  { chapterTitle: "Floating Lands", missionPrompt: "Draw a floating island with a small waterfall and clouds beneath it.", missionTheme: "Sky Adventure" },
  { chapterTitle: "Spirit Guardians", missionPrompt: "Draw a cave entrance guarded by friendly glowing spirits.", missionTheme: "Mystic Caves" },
  { chapterTitle: "River Crossing", missionPrompt: "Draw a wooden bridge over a sparkling river with lily pads.", missionTheme: "River Quest" },
  { chapterTitle: "Campfire Tales", missionPrompt: "Draw a cozy campfire surrounded by mushrooms and mossy stones.", missionTheme: "Forest Camp" },
  { chapterTitle: "Crystal Bloom", missionPrompt: "Draw a giant crystal flower opening in moonlight.", missionTheme: "Crystal Garden" },
  { chapterTitle: "Sky Ship", missionPrompt: "Draw a small airship with colorful sails crossing the clouds.", missionTheme: "Sky Realm" },
  { chapterTitle: "Dragon Friend", missionPrompt: "Draw a baby dragon hatching from a golden egg.", missionTheme: "Dragon Peak" },
  { chapterTitle: "Hidden Door", missionPrompt: "Draw an ancient stone door covered in vines and runes.", missionTheme: "Ancient Ruins" },
  { chapterTitle: "Lantern Path", missionPrompt: "Draw a path of hanging lanterns through a dark forest.", missionTheme: "Night Trail" },
  { chapterTitle: "Mushroom Village", missionPrompt: "Draw tiny houses built inside oversized mushrooms.", missionTheme: "Whimsy Vale" },
  { chapterTitle: "Frozen Lake", missionPrompt: "Draw a frozen lake with a fish visible under the ice.", missionTheme: "Winter Glade" },
  { chapterTitle: "Volcano View", missionPrompt: "Draw a safe observation hut near a gentle cartoon volcano.", missionTheme: "Lava Lands" },
  { chapterTitle: "Treasure Map", missionPrompt: "Draw an old treasure map with an X marking a hill.", missionTheme: "Pirate Trail" },
  { chapterTitle: "Rainbow Arch", missionPrompt: "Draw a rainbow arch over a meadow with butterflies.", missionTheme: "Color Fields" },
  { chapterTitle: "Owl Tower", missionPrompt: "Draw a tall owl tower with windows glowing at dusk.", missionTheme: "Wise Woods" },
  { chapterTitle: "Sand Castle", missionPrompt: "Draw a detailed sand castle with flags and a moat.", missionTheme: "Sunny Shore" },
  { chapterTitle: "Robot Helper", missionPrompt: "Draw a friendly robot offering a flower to a traveler.", missionTheme: "Future Meadow" },
  { chapterTitle: "Giant Snail", missionPrompt: "Draw a giant snail carrying a tiny house on its shell.", missionTheme: "Slow Journey" },
  { chapterTitle: "Star Observatory", missionPrompt: "Draw a hilltop telescope pointed at a comet in the sky.", missionTheme: "Stargazer Hill" },
];

export const pickFallbackMission = ({ chapterNumber = 1, level = 0, previousPrompts = [] }) => {
  const startIndex = (chapterNumber * 5 + level * 3) % MISSION_FALLBACKS.length;
  for (let offset = 0; offset < MISSION_FALLBACKS.length; offset += 1) {
    const candidate = MISSION_FALLBACKS[(startIndex + offset) % MISSION_FALLBACKS.length];
    if (!previousPrompts.includes(candidate.missionPrompt)) {
      return {
        ...candidate,
        chapterTitle: `${candidate.chapterTitle} — Chapter ${chapterNumber}`,
      };
    }
  }
  const fallback = MISSION_FALLBACKS[startIndex];
  return {
    ...fallback,
    chapterTitle: `${fallback.chapterTitle} — Chapter ${chapterNumber}`,
    missionPrompt: `${fallback.missionPrompt} (variant ${chapterNumber})`,
  };
};
