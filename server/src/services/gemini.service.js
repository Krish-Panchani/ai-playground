import { GoogleGenAI } from "@google/genai";

import { env } from "../config/env.js";
import { pickFallbackMission } from "../data/mission-fallbacks.js";
import { normalizeMissionTimer } from "../utils/mission-timer.js";
import { STORY_MAX_CHAPTERS } from "../constants/story.js";
import { buildStoryContext } from "../utils/story-context.js";
import { isGeminiRetryableError, withGeminiRetry } from "../utils/gemini-retry.js";

const getImagePartFromDataUrl = (imageDataUrl) => {
  const [meta, data] = imageDataUrl.split(",");
  const mimeType = meta.match(/data:(.*);base64/)?.[1] || "image/png";
  return { mimeType, data };
};

const parseJsonResponse = (text) => {
  try {
    return JSON.parse(text);
  } catch (_error) {
    throw new Error("Gemini returned invalid JSON");
  }
};

class GeminiService {
  constructor() {
    this.client = env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: env.GEMINI_API_KEY }) : null;
  }

  async generateJson({ model, contents, config = {} }) {
    if (!this.client) {
      throw new Error("Gemini client is not configured");
    }

    const response = await withGeminiRetry(() =>
      this.client.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: "application/json",
          ...config,
        },
      })
    );

    return parseJsonResponse(response.text);
  }

  async evaluateCreativeQuest({ missionPrompt, imageDataUrl }) {
    if (!this.client) {
      return this.mockCreativeQuestScore();
    }

    const image = getImagePartFromDataUrl(imageDataUrl);
    const prompt = `User mission: "${missionPrompt}".
Analyze this drawing and return strict JSON:
{
  "accuracy": number (0-100),
  "creativity": number (0-100),
  "effort": number (0-100),
  "feedback": string
}
Output only JSON.`;

    try {
      return await this.generateJson({
        model: env.GEMINI_VISION_MODEL,
        contents: [{ text: prompt }, { inlineData: image }],
      });
    } catch (error) {
      if (isGeminiRetryableError(error)) {
        console.warn("Gemini vision busy — using fallback creative quest score.", error?.message);
        return this.mockCreativeQuestScore(
          "Great effort! Gemini is busy right now, so we used a practice score. Submit again later for a full AI review."
        );
      }
      throw error;
    }
  }

  mockCreativeQuestScore(feedback) {
    return {
      accuracy: 72,
      creativity: 76,
      effort: 74,
      feedback:
        feedback ||
        "Good work. Connect your drawing details more closely to the mission.",
    };
  }

  async generateCreativeQuestMission({
    ageGroup,
    skillLevel,
    level,
    chapterNumber = 1,
    worldName = "Forest of Beginnings",
    previousMissionPrompts = [],
  }) {
    if (!this.client) {
      const fallback = pickFallbackMission({
        chapterNumber,
        level,
        previousPrompts: previousMissionPrompts,
      });
      return {
        ...fallback,
        timerSeconds: normalizeMissionTimer(null, skillLevel, chapterNumber),
      };
    }

    const bannedList =
      previousMissionPrompts.length > 0
        ? previousMissionPrompts.map((item, index) => `${index + 1}. ${item}`).join("\n")
        : "None yet.";

    const prompt = `Generate ONE unique drawing mission for chapter ${chapterNumber} in world "${worldName}".

Player profile:
- ageGroup: ${ageGroup}
- skillLevel: ${skillLevel}
- playerLevel: ${level}

Previously used missions (DO NOT repeat or paraphrase these):
${bannedList}

Rules:
- Family friendly
- One clear drawable objective (not a full scene essay)
- Must be DIFFERENT from all previous missions
- Avoid generic repeats like "draw a sun" unless chapter 1 only
- Increase detail/complexity slightly with chapter number
- timerSeconds should be between 150 and 300 based on skill (${skillLevel})

Return strict JSON:
{
  "chapterTitle": string,
  "missionPrompt": string,
  "timerSeconds": number,
  "missionTheme": string
}
Output only JSON.`;

    try {
      const parsed = await this.generateJson({
        model: env.GEMINI_STORY_MODEL,
        contents: [{ text: prompt }],
        config: { temperature: 1.1 },
      });

      const duplicate = previousMissionPrompts.some(
        (item) => item.trim().toLowerCase() === String(parsed.missionPrompt || "").trim().toLowerCase()
      );

      if (duplicate || !parsed.missionPrompt) {
        throw new Error("Duplicate or empty mission from model");
      }

      return {
        chapterTitle: parsed.chapterTitle || `Chapter ${chapterNumber}`,
        missionPrompt: parsed.missionPrompt,
        missionTheme: parsed.missionTheme || worldName,
        timerSeconds: normalizeMissionTimer(parsed.timerSeconds, skillLevel, chapterNumber),
      };
    } catch (_error) {
      const fallback = pickFallbackMission({
        chapterNumber,
        level,
        previousPrompts: previousMissionPrompts,
      });
      return {
        ...fallback,
        timerSeconds: normalizeMissionTimer(null, skillLevel, chapterNumber),
      };
    }
  }

  async guessDrawing({ imageDataUrl, additionalPrompt = "" }) {
    if (!this.client) {
      return this.mockGuessResult();
    }

    const image = getImagePartFromDataUrl(imageDataUrl);
    const prompt = `Guess what the user drew.
Additional context: "${additionalPrompt}".
Return strict JSON:
{
  "guess": string,
  "confidence": number (0-100),
  "feedback": string
}
Output only JSON.`;

    try {
      return await this.generateJson({
        model: env.GEMINI_VISION_MODEL,
        contents: [{ text: prompt }, { inlineData: image }],
      });
    } catch (error) {
      if (isGeminiRetryableError(error)) {
        console.warn("Gemini vision busy — using fallback guess.", error?.message);
        return this.mockGuessResult();
      }
      throw error;
    }
  }

  mockGuessResult() {
    return {
      guess: "A creative doodle",
      confidence: 60,
      feedback: "Nice start. Gemini is busy — this is a practice guess. Try again in a few minutes.",
    };
  }

  async generateStoryChapter({
    imageDataUrl,
    currentStory = "",
    additionalPrompt = "",
    chapterNumber = 1,
    isFinalChapter = false,
  }) {
    if (!this.client) {
      return this.mockStoryChapter({ chapterNumber, isFinalChapter });
    }

    const image = getImagePartFromDataUrl(imageDataUrl);
    const hasPriorChapters = Boolean(currentStory?.trim());
    const narrativeContext = hasPriorChapters
      ? `Story so far:\n${currentStory}\n\nContinue this narrative with chapter ${chapterNumber} of ${STORY_MAX_CHAPTERS} based on the drawing.`
      : `This is chapter 1 of ${STORY_MAX_CHAPTERS} — the opening chapter of a brand-new adventure based on the drawing.`;

    const finaleInstruction = isFinalChapter
      ? `This is the FINAL chapter (${STORY_MAX_CHAPTERS} of ${STORY_MAX_CHAPTERS}). Bring the adventure to a satisfying, emotional close. Set "nextMission" to an empty string.`
      : `Include "nextMission" — a short, fun drawing prompt for what the player should draw in the next chapter.`;

    const prompt = `You are a family-friendly adventure storyteller.
${narrativeContext}
Additional user instruction: "${additionalPrompt}".
${finaleInstruction}
Return strict JSON:
{
  "title": string,
  "chapter": string (max 150 words),
  "nextMission": string
}
Output only JSON.`;

    try {
      return await this.generateJson({
        model: env.GEMINI_STORY_MODEL,
        contents: [{ text: prompt }, { inlineData: image }],
      });
    } catch (error) {
      if (isGeminiRetryableError(error)) {
        console.warn("Gemini story busy — using fallback chapter.", error?.message);
        return this.mockStoryChapter({ chapterNumber, isFinalChapter });
      }
      throw error;
    }
  }

  async generateCompleteStory({ title, chapters = [] }) {
    const chapterText = buildStoryContext(chapters);

    if (!this.client) {
      return this.mockCompleteStory(chapters);
    }

    const prompt = `You are a children's story editor. The player illustrated an adventure across ${chapters.length} chapters.

Story title: "${title}"

Chapter text:
${chapterText}

Rewrite this into one cohesive, family-friendly story that reads smoothly from start to finish.
Return strict JSON:
{
  "fullStory": string (max 700 words, flowing narrative),
  "conclusion": string (2-3 sentences, warm closing line for the reader)
}
Output only JSON.`;

    try {
      return await this.generateJson({
        model: env.GEMINI_STORY_MODEL,
        contents: [{ text: prompt }],
      });
    } catch (error) {
      if (isGeminiRetryableError(error)) {
        console.warn("Gemini complete-story busy — using stitched fallback.", error?.message);
        return this.mockCompleteStory(chapters);
      }
      throw error;
    }
  }

  mockStoryChapter({ chapterNumber = 1, isFinalChapter = false } = {}) {
    return {
      title: isFinalChapter ? "The Grand Finale" : `Chapter ${chapterNumber}`,
      chapter: isFinalChapter
        ? "With one last brave step, our hero finds home again — changed by the journey, smiling at the stars."
        : "A new scene opens as your character steps into unknown lands.",
      nextMission: isFinalChapter ? "" : "Draw a glowing cave entrance.",
    };
  }

  mockCompleteStory(chapters = []) {
    const fullStory = chapters.map((chapter) => chapter.chapter).join("\n\n");
    return {
      fullStory: fullStory || "A magical adventure unfolds across every drawing you made.",
      conclusion: "And so the adventure came to an end — until the next blank canvas calls.",
    };
  }
}

export const geminiService = new GeminiService();
