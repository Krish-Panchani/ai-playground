import { Router } from "express";
import {
  abortSession,
  advanceSessionMission,
  createSession,
  failCurrentMission,
  getMyAdventures,
  getSession,
} from "../../controllers/game.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.use(requireAuth);

router.get("/sessions/mine", asyncHandler(getMyAdventures));
router.post("/sessions", asyncHandler(createSession));
router.get("/sessions/:id", asyncHandler(getSession));
router.post("/sessions/:id/abort", asyncHandler(abortSession));
router.post("/sessions/:id/next-mission", asyncHandler(advanceSessionMission));
router.post("/sessions/:id/fail-current-mission", asyncHandler(failCurrentMission));

export default router;
