import "dotenv/config";
import { z } from "zod";

const defaultClientOrigin =
  process.env.CLIENT_ORIGIN ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:5173");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(8080),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().default("ai_playground"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_VISION_MODEL: z.string().default("gemini-2.5-flash"),
  GEMINI_STORY_MODEL: z.string().default("gemini-2.5-flash"),
  CLIENT_ORIGIN: z.string().default(defaultClientOrigin),
  GOOGLE_CLIENT_ID: z.string().optional(),
  JWT_SECRET: z.string().default("dev-jwt-secret-change-in-production"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

export const env = envSchema.parse({
  ...process.env,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || defaultClientOrigin,
});
