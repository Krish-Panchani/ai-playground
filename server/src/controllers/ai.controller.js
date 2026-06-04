import mongoose from "mongoose";

import { DrawingModel } from "../models/drawing.model.js";
import { GameSessionModel } from "../models/game-session.model.js";
import { StoryModel } from "../models/story.model.js";
import {
  creativeQuestMissionSchema,
  creativeQuestSubmissionSchema,
  guessworkSchema,
  storyChapterSchema,
} from "../schemas/ai.schema.js";
import { geminiService } from "../services/gemini.service.js";
import { computeCreativeQuestScore, levelFromXp } from "../services/progression.service.js";
import { getOrCreateUserFromRequest } from "../utils/get-or-create-user.js";

export const submitCreativeQuest = async (req, res) => {
  const payload = creativeQuestSubmissionSchema.parse(req.body);
  const user = await getOrCreateUserFromRequest(req.user);

  const aiResult = await geminiService.evaluateCreativeQuest(payload);
  const scoreResult = computeCreativeQuestScore(aiResult);

  const drawing = await DrawingModel.create({
    userId: user?._id || undefined,
    sessionId:
      payload.sessionId && mongoose.isValidObjectId(payload.sessionId)
        ? payload.sessionId
        : undefined,
    chapterNumber: payload.chapterNumber || null,
    mode: "creative-quest",
    prompt: payload.missionPrompt,
    imageDataUrl: payload.imageDataUrl,
    aiResult,
    finalScore: scoreResult.finalScore,
    xpEarned: scoreResult.xpEarned,
  });

  let profile = null;
  if (user) {
    user.xp = (user.xp || 0) + scoreResult.xpEarned;
    user.level = levelFromXp(user.xp);
    await user.save();

    profile = { xp: user.xp, level: user.level };
  }

  if (payload.sessionId && mongoose.isValidObjectId(payload.sessionId)) {
    const session = await GameSessionModel.findById(payload.sessionId);
    if (session) {
      const mission = session.missions.find(
        (item) => item.chapterNumber === (payload.chapterNumber || session.chapterCursor)
      );
      if (mission) {
        mission.status = "completed";
        mission.score = scoreResult.finalScore;
        mission.xpEarned = scoreResult.xpEarned;
      }
      await session.save();
    }
  }

  res.status(200).json({
    ok: true,
    data: {
      drawingId: drawing._id,
      aiResult,
      finalScore: scoreResult.finalScore,
      xpEarned: scoreResult.xpEarned,
      profile,
      nextMissionHint: "Draw the next mission object in your adventure.",
    },
  });
};

export const generateCreativeQuestMission = async (req, res) => {
  const payload = creativeQuestMissionSchema.parse(req.body || {});
  const user = await getOrCreateUserFromRequest(req.user);

  const mission = await geminiService.generateCreativeQuestMission({
    ageGroup: payload.ageGroup,
    skillLevel: payload.skillLevel,
    level: user?.level ?? payload.level ?? 0,
    chapterNumber: payload.chapterNumber || 1,
    previousMissionPrompts: payload.previousMissionPrompts || [],
  });

  res.status(200).json({
    ok: true,
    data: {
      ...mission,
      playerLevel: user?.level ?? payload.level ?? 0,
    },
  });
};

export const submitGuesswork = async (req, res) => {
  const payload = guessworkSchema.parse(req.body);
  const user = await getOrCreateUserFromRequest(req.user);
  const aiResult = await geminiService.guessDrawing(payload);

  const drawing = await DrawingModel.create({
    userId: user?._id || undefined,
    mode: "guesswork",
    imageDataUrl: payload.imageDataUrl,
    prompt: payload.additionalPrompt || "",
    aiResult,
    finalScore: Math.round((aiResult.confidence || 50) * 0.4),
    xpEarned: 8,
  });

  let profile = null;
  if (user) {
    user.xp = (user.xp || 0) + 8;
    user.level = levelFromXp(user.xp);
    await user.save();
    profile = { xp: user.xp, level: user.level };
  }

  res.status(200).json({
    ok: true,
    data: {
      drawingId: drawing._id,
      aiResult,
      xpEarned: 8,
      profile,
    },
  });
};

export const generateStoryChapter = async (req, res) => {
  const payload = storyChapterSchema.parse(req.body);
  const user = await getOrCreateUserFromRequest(req.user);

  const aiResult = await geminiService.generateStoryChapter(payload);

  const drawing = await DrawingModel.create({
    userId: user?._id || undefined,
    mode: "story-builder",
    imageDataUrl: payload.imageDataUrl,
    prompt: payload.additionalPrompt || "",
    aiResult,
    xpEarned: 15,
  });

  let story;
  if (payload.storyId && mongoose.isValidObjectId(payload.storyId)) {
    story = await StoryModel.findById(payload.storyId);
  }

  if (!story) {
    story = await StoryModel.create({
      userId: user?._id || undefined,
      title: aiResult.title,
      chapters: [],
    });
  }

  story.chapters.push({
    title: aiResult.title,
    chapter: aiResult.chapter,
    nextMission: aiResult.nextMission,
    drawingId: drawing._id,
  });

  if (story.chapters.length >= 10) {
    story.isCompleted = true;
  }

  await story.save();

  let profile = null;
  if (user) {
    user.xp = (user.xp || 0) + 15;
    user.level = levelFromXp(user.xp);
    await user.save();
    profile = { xp: user.xp, level: user.level };
  }

  res.status(200).json({
    ok: true,
    data: {
      storyId: story._id,
      isCompleted: story.isCompleted,
      chapterCount: story.chapters.length,
      aiResult,
      xpEarned: 15,
      profile,
    },
  });
};
