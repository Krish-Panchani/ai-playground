import mongoose from "mongoose";

const drawingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "GameSession", index: true },
    chapterNumber: { type: Number, default: null },
    mode: { type: String, enum: ["creative-quest", "guesswork", "story-builder"], required: true },
    prompt: { type: String, default: "" },
    imageDataUrl: { type: String, required: true },
    aiResult: { type: mongoose.Schema.Types.Mixed, default: {} },
    finalScore: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const DrawingModel = mongoose.model("Drawing", drawingSchema);
