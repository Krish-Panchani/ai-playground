import { z } from "zod";

const dataUrlSchema = z
  .string()
  .min(100, "imageDataUrl is too short")
  .startsWith("data:image", "imageDataUrl must be image data URL");

export const creativeQuestSubmissionSchema = z.object({
  sessionId: z.string().optional(),
  chapterNumber: z.number().int().min(1).optional(),
  missionPrompt: z.string().min(3),
  imageDataUrl: dataUrlSchema,
});

export const creativeQuestMissionSchema = z.object({
  ageGroup: z.string().min(3).optional().default("General"),
  skillLevel: z.string().min(3).optional().default("Beginner"),
  level: z.number().int().min(0).optional().default(0),
});

export const guessworkSchema = z.object({
  imageDataUrl: dataUrlSchema,
  additionalPrompt: z.string().optional().default(""),
});

export const storyChapterSchema = z.object({
  imageDataUrl: dataUrlSchema,
  currentStory: z.string().optional().default(""),
  additionalPrompt: z.string().optional().default(""),
  storyId: z.string().optional(),
});
