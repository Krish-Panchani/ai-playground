export const computeCreativeQuestScore = ({ accuracy, creativity, effort }) => {
  const normalizedAccuracy = Number(accuracy) || 0;
  const normalizedCreativity = Number(creativity) || 0;
  const normalizedEffort = Number(effort) || 0;

  const finalScore =
    normalizedAccuracy * 0.5 +
    normalizedCreativity * 0.3 +
    normalizedEffort * 0.2;

  const xpEarned = Math.max(10, Math.round(finalScore / 2));

  return {
    finalScore: Math.round(finalScore),
    xpEarned,
  };
};

export const levelFromXp = (xp) => Math.floor((Number(xp) || 0) / 100);
