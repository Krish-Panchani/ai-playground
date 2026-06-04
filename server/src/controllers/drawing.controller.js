import mongoose from "mongoose";
import { z } from "zod";

import { DrawingModel } from "../models/drawing.model.js";

const feedbackSchema = z.object({
  isCorrect: z.boolean(),
});

export const submitDrawingFeedback = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ ok: false, message: "Invalid drawing id" });
  }

  const payload = feedbackSchema.parse(req.body);
  const drawing = await DrawingModel.findById(id);

  if (!drawing) {
    return res.status(404).json({ ok: false, message: "Drawing not found" });
  }

  drawing.aiResult = {
    ...(drawing.aiResult || {}),
    userFeedback: payload.isCorrect,
    isCorrect: payload.isCorrect,
  };
  await drawing.save();

  res.status(200).json({
    ok: true,
    data: {
      drawingId: drawing._id,
      isCorrect: payload.isCorrect,
    },
  });
};
