import mongoose from "mongoose";

const missionSchema = new mongoose.Schema(
  {
    chapterNumber: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    missionPrompt: { type: String, required: true },
    missionTheme: { type: String, default: "Adventure" },
    timerSeconds: { type: Number, default: 120 },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    score: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
  },
  { _id: false }
);

const gameSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    mode: { type: String, default: "creative-quest" },
    worldName: { type: String, default: "Forest of Beginnings" },
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },
    chapterCursor: { type: Number, default: 1 },
    missions: { type: [missionSchema], default: [] },
  },
  { timestamps: true }
);

export const GameSessionModel = mongoose.model("GameSession", gameSessionSchema);
