import mongoose from "mongoose";
import { ZodError } from "zod";

import { ADVENTURE_WORLDS } from "../data/mission-fallbacks.js";
import { GameSessionModel } from "../models/game-session.model.js";
import { createSessionSchema, nextMissionSchema } from "../schemas/game.schema.js";
import { geminiService } from "../services/gemini.service.js";
import { getOrCreateUserFromRequest } from "../utils/get-or-create-user.js";
import { normalizeMissionTimer } from "../utils/mission-timer.js";

const worldForChapter = (chapterNumber) =>
  ADVENTURE_WORLDS[(Math.max(1, chapterNumber) - 1) % ADVENTURE_WORLDS.length];

const missionFromAi = (aiMission, chapterNumber, skillLevel = "Beginner") => ({
  chapterNumber,
  chapterTitle: aiMission.chapterTitle || `Adventure Chapter ${chapterNumber}`,
  missionPrompt: aiMission.missionPrompt,
  missionTheme: aiMission.missionTheme || worldForChapter(chapterNumber),
  timerSeconds: normalizeMissionTimer(aiMission.timerSeconds, skillLevel, chapterNumber),
  status: "pending",
  score: 0,
  xpEarned: 0,
});

const buildMission = async ({ ageGroup, skillLevel, level, chapterNumber, previousMissionPrompts }) => {
  const aiMission = await geminiService.generateCreativeQuestMission({
    ageGroup,
    skillLevel,
    level,
    chapterNumber,
    worldName: worldForChapter(chapterNumber),
    previousMissionPrompts,
  });
  return missionFromAi(aiMission, chapterNumber, skillLevel);
};

export const createSession = async (req, res, next) => {
  try {
    const payload = createSessionSchema.parse(req.body || {});
    const user = await getOrCreateUserFromRequest(req.user);
    const level = user?.level || 0;

    const firstMission = await buildMission({
      ageGroup: payload.ageGroup,
      skillLevel: payload.skillLevel,
      level,
      chapterNumber: 1,
      previousMissionPrompts: [],
    });

    const session = await GameSessionModel.create({
      userId: user?._id || undefined,
      mode: "creative-quest",
      worldName: worldForChapter(1),
      chapterCursor: 1,
      missions: [firstMission],
    });

    return res.status(201).json({
      ok: true,
      data: {
        sessionId: session._id,
        status: session.status,
        currentMission: session.missions[0],
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ ok: false, message: "Invalid payload", issues: error.issues });
    }
    return next(error);
  }
};

export const getSession = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: "Invalid session id" });
  }
  const session = await GameSessionModel.findById(id).lean();
  if (!session) {
    return res.status(404).json({ ok: false, message: "Session not found" });
  }
  const currentMission =
    session.missions.find((mission) => mission.chapterNumber === session.chapterCursor) || null;

  return res.status(200).json({
    ok: true,
    data: {
      sessionId: session._id,
      status: session.status,
      chapterCursor: session.chapterCursor,
      currentMission,
      missions: session.missions,
    },
  });
};

export const advanceSessionMission = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ ok: false, message: "Invalid session id" });
    }
    const payload = nextMissionSchema.parse(req.body || {});
    const user = await getOrCreateUserFromRequest(req.user);
    const session = await GameSessionModel.findById(id);
    if (!session) {
      return res.status(404).json({ ok: false, message: "Session not found" });
    }

    const nextChapter = session.chapterCursor + 1;
    const previousMissionPrompts = session.missions.map((item) => item.missionPrompt);
    const mission = await buildMission({
      ageGroup: payload.ageGroup,
      skillLevel: payload.skillLevel,
      level: user?.level || 0,
      chapterNumber: nextChapter,
      previousMissionPrompts,
    });

    session.chapterCursor = nextChapter;
    session.worldName = worldForChapter(nextChapter);
    session.missions.push(mission);

    if (nextChapter >= 10) {
      session.status = "completed";
    }

    await session.save();

    return res.status(200).json({
      ok: true,
      data: {
        sessionId: session._id,
        status: session.status,
        currentMission: mission,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ ok: false, message: "Invalid payload", issues: error.issues });
    }
    return next(error);
  }
};

export const failCurrentMission = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: "Invalid session id" });
  }

  const session = await GameSessionModel.findById(id);
  if (!session) {
    return res.status(404).json({ ok: false, message: "Session not found" });
  }

  const mission = session.missions.find((item) => item.chapterNumber === session.chapterCursor);
  if (mission && mission.status === "pending") {
    mission.status = "failed";
    mission.score = 0;
    mission.xpEarned = 0;
  }
  await session.save();

  return res.status(200).json({
    ok: true,
    data: {
      sessionId: session._id,
      chapterCursor: session.chapterCursor,
      currentMission: mission || null,
    },
  });
};

export const abortSession = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: "Invalid session id" });
  }

  const session = await GameSessionModel.findById(id);
  if (!session) {
    return res.status(404).json({ ok: false, message: "Session not found" });
  }

  const mission = session.missions.find((item) => item.chapterNumber === session.chapterCursor);
  if (mission && mission.status === "pending") {
    mission.status = "failed";
  }

  session.status = "abandoned";
  await session.save();

  return res.status(200).json({
    ok: true,
    data: {
      sessionId: session._id,
      status: session.status,
    },
  });
};

export const getMyAdventures = async (req, res) => {
  const user = await getOrCreateUserFromRequest(req.user);
  if (!user) {
    return res.status(200).json({ ok: true, data: [] });
  }

  const sessions = await GameSessionModel.find({ userId: user._id, mode: "creative-quest" })
    .sort({ updatedAt: -1 })
    .limit(30)
    .lean();

  return res.status(200).json({
    ok: true,
    data: sessions.map((session) => ({
      sessionId: session._id,
      status: session.status,
      worldName: session.worldName,
      chapterCursor: session.chapterCursor,
      missions: session.missions,
      updatedAt: session.updatedAt,
      createdAt: session.createdAt,
      completedCount: session.missions.filter((item) => item.status === "completed").length,
      totalXp: session.missions.reduce((sum, item) => sum + (item.xpEarned || 0), 0),
    })),
  });
};
