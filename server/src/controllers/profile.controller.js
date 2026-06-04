import { DrawingModel } from "../models/drawing.model.js";
import { GameSessionModel } from "../models/game-session.model.js";
import { StoryModel } from "../models/story.model.js";
import { UserModel } from "../models/user.model.js";
import { levelFromXp } from "../services/progression.service.js";
import { getOrCreateUserFromRequest, getUserProfile } from "../utils/get-or-create-user.js";

const mapSession = (session) => ({
  sessionId: session._id,
  status: session.status,
  worldName: session.worldName,
  chapterCursor: session.chapterCursor,
  missions: session.missions,
  updatedAt: session.updatedAt,
  createdAt: session.createdAt,
  completedCount: session.missions.filter((item) => item.status === "completed").length,
  failedCount: session.missions.filter((item) => item.status === "failed").length,
  totalXp: session.missions.reduce((sum, item) => sum + (item.xpEarned || 0), 0),
});

const mapDrawing = (drawing) => ({
  id: drawing._id,
  mode: drawing.mode,
  prompt: drawing.prompt,
  finalScore: drawing.finalScore,
  xpEarned: drawing.xpEarned,
  chapterNumber: drawing.chapterNumber,
  createdAt: drawing.createdAt,
  summary:
    drawing.mode === "guesswork"
      ? drawing.aiResult?.guess || "Guesswork drawing"
      : drawing.mode === "story-builder"
        ? drawing.aiResult?.title || "Story chapter"
        : drawing.aiResult?.feedback || drawing.prompt || "Creative Quest drawing",
});

const mapStory = (story) => ({
  id: story._id,
  title: story.title,
  chapterCount: story.chapters?.length || 0,
  isCompleted: story.isCompleted,
  updatedAt: story.updatedAt,
  createdAt: story.createdAt,
});

export const getMyProfileDashboard = async (req, res) => {
  const user = await getOrCreateUserFromRequest(req.user);
  if (!user) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }

  const xp = user.xp || 0;
  const level = user.level ?? levelFromXp(xp);
  const xpIntoLevel = xp % 100;
  const xpToNextLevel = 100 - xpIntoLevel;

  const userId = user._id;

  const [
    recentDrawings,
    sessions,
    stories,
    rank,
    modeCounts,
    totalDrawings,
    totalAdventures,
    totalStories,
    missionStats,
    completedAdventures,
    completedStories,
  ] = await Promise.all([
    DrawingModel.find({ userId })
      .select("-imageDataUrl")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    GameSessionModel.find({ userId, mode: "creative-quest" })
      .sort({ updatedAt: -1 })
      .limit(15)
      .lean(),
    StoryModel.find({ userId }).sort({ updatedAt: -1 }).limit(10).lean(),
    UserModel.countDocuments({ xp: { $gt: xp } }),
    DrawingModel.aggregate([
      { $match: { userId } },
      { $group: { _id: "$mode", count: { $sum: 1 } } },
    ]),
    DrawingModel.countDocuments({ userId }),
    GameSessionModel.countDocuments({ userId }),
    StoryModel.countDocuments({ userId }),
    GameSessionModel.aggregate([
      { $match: { userId } },
      { $unwind: "$missions" },
      {
        $group: {
          _id: null,
          completed: {
            $sum: { $cond: [{ $eq: ["$missions.status", "completed"] }, 1, 0] },
          },
        },
      },
    ]),
    GameSessionModel.countDocuments({ userId, status: "completed" }),
    StoryModel.countDocuments({ userId, isCompleted: true }),
  ]);

  const countByMode = Object.fromEntries(modeCounts.map((row) => [row._id, row.count]));
  const missionsCompleted = missionStats[0]?.completed || 0;

  return res.status(200).json({
    ok: true,
    data: {
      user: {
        ...getUserProfile(user),
        memberSince: user.createdAt,
        xpIntoLevel,
        xpToNextLevel,
        levelProgressPercent: xpIntoLevel,
      },
      rank: rank + 1,
      stats: {
        totalDrawings,
        creativeQuestDrawings: countByMode["creative-quest"] || 0,
        guessworkDrawings: countByMode.guesswork || 0,
        storyDrawings: countByMode["story-builder"] || 0,
        adventuresStarted: totalAdventures,
        adventuresCompleted: completedAdventures,
        missionsCompleted,
        storiesStarted: totalStories,
        storiesCompleted: completedStories,
      },
      adventures: sessions.map(mapSession),
      recentDrawings: recentDrawings.map(mapDrawing),
      stories: stories.map(mapStory),
    },
  });
};
