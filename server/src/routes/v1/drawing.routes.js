import { Router } from "express";
import { ZodError } from "zod";

import { submitDrawingFeedback } from "../../controllers/drawing.controller.js";
import { optionalAuth } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.use(optionalAuth);
router.post("/:id/feedback", asyncHandler(submitDrawingFeedback));

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
