import { DrawingModel } from "../models/drawing.model.js";
import { StoryModel } from "../models/story.model.js";

const mapCreativeQuest = (drawing) => ({
  id: drawing._id,
  file: String(drawing._id),
  question: drawing.prompt,
  reason: drawing.aiResult?.feedback || drawing.aiResult?.reason || "",
  isCorrect: drawing.aiResult?.isCorrect ?? null,
  imageUrl: drawing.imageDataUrl,
});

const mapGuesswork = (drawing) => ({
  id: drawing._id,
  file: String(drawing._id),
  guess: drawing.aiResult?.guess || "",
  isCorrect: drawing.aiResult?.userFeedback ?? drawing.aiResult?.isCorrect ?? null,
  imageUrl: drawing.imageDataUrl,
});

export const getGallery = async (_req, res) => {
  const [creativeQuestDrawings, guessworkDrawings, stories] = await Promise.all([
    DrawingModel.find({ mode: "creative-quest" })
      .sort({ createdAt: -1 })
      .limit(40)
      .lean(),
    DrawingModel.find({ mode: "guesswork" })
      .sort({ createdAt: -1 })
      .limit(40)
      .lean(),
    StoryModel.find()
      .sort({ updatedAt: -1 })
      .limit(40)
      .lean(),
  ]);

  const storyDrawingIds = stories
    .map((story) => story.chapters?.[story.chapters.length - 1]?.drawingId)
    .filter(Boolean);

  const storyDrawings = storyDrawingIds.length
    ? await DrawingModel.find({ _id: { $in: storyDrawingIds } }).lean()
    : [];

  const drawingById = new Map(storyDrawings.map((drawing) => [String(drawing._id), drawing]));

  const artfulStories = stories.map((story) => {
    const lastChapter = story.chapters?.[story.chapters.length - 1];
    const drawing = lastChapter?.drawingId
      ? drawingById.get(String(lastChapter.drawingId))
      : null;

    return {
      id: story._id,
      file: drawing ? String(drawing._id) : String(story._id),
      title: story.title || lastChapter?.title || "Untitled Adventure",
      story: lastChapter?.chapter || "",
      imageUrl: drawing?.imageDataUrl || null,
    };
  });

  res.status(200).json({
    ok: true,
    data: {
      creativeQuest: creativeQuestDrawings.map(mapCreativeQuest),
      artfulGuesswork: guessworkDrawings.map(mapGuesswork),
      artfulStories,
    },
  });
};
