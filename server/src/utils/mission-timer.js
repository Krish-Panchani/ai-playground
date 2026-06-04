const SKILL_SECONDS = {
  Beginner: 240,
  Intermediate: 210,
  Advanced: 180,
  Expert: 150,
};

export const normalizeMissionTimer = (requestedSeconds, skillLevel = "Beginner", chapterNumber = 1) => {
  const skillBase = SKILL_SECONDS[skillLevel] || 210;
  const chapterBonus = Math.min(60, (chapterNumber - 1) * 5);
  const parsed = Number(requestedSeconds);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return skillBase + chapterBonus;
  }

  return Math.max(120, Math.min(360, Math.round(parsed)));
};
