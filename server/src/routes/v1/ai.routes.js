import { Router } from "express";
import { ZodError } from "zod";

import {
  generateCreativeQuestMission,
  generateStoryChapter,
  submitCreativeQuest,
  submitGuesswork,
} from "../../controllers/ai.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.use(requireAuth);

router.post("/creative-quest/mission", asyncHandler(generateCreativeQuestMission));
router.post("/creative-quest/submit", asyncHandler(submitCreativeQuest));
router.post("/guesswork/submit", asyncHandler(submitGuesswork));
router.post("/stories/chapter", asyncHandler(generateStoryChapter));

router.use((error, _req, res, next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      message: "Invalid request payload",
      issues: error.issues,
    });
  }
  return next(error);
});

export default router;
