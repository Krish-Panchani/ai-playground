import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    chapter: { type: String, required: true },
    nextMission: { type: String, default: "" },
    drawingId: { type: mongoose.Schema.Types.ObjectId, ref: "Drawing" },
  },
  { _id: false }
);

const storySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    title: { type: String, default: "Untitled Adventure" },
    chapters: { type: [chapterSchema], default: [] },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const StoryModel = mongoose.model("Story", storySchema);
