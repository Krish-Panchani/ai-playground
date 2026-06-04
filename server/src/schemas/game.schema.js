import { z } from "zod";

export const createSessionSchema = z.object({
  ageGroup: z.string().min(3).optional().default("General"),
  skillLevel: z.string().min(3).optional().default("Beginner"),
});

export const nextMissionSchema = z.object({
  ageGroup: z.string().min(3).optional().default("General"),
  skillLevel: z.string().min(3).optional().default("Beginner"),
});
