import { Router } from "express";
import { getLeaderboard } from "../../controllers/user.controller.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.get("/", asyncHandler(getLeaderboard));

export default router;
