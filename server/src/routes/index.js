import { Router } from "express";

import aiRouter from "./v1/ai.routes.js";
import authRouter from "./v1/auth.routes.js";
import challengeRouter from "./v1/challenge.routes.js";
import drawingRouter from "./v1/drawing.routes.js";
import galleryRouter from "./v1/gallery.routes.js";
import gameRouter from "./v1/game.routes.js";
import leaderboardRouter from "./v1/leaderboard.routes.js";
import storyRouter from "./v1/story.routes.js";
import userRouter from "./v1/user.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/ai", aiRouter);
router.use("/gallery", galleryRouter);
router.use("/users", userRouter);
router.use("/games", gameRouter);
router.use("/drawings", drawingRouter);
router.use("/stories", storyRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/challenges", challengeRouter);

export default router;
