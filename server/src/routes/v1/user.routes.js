import { Router } from "express";

import { getMyProfileDashboard } from "../../controllers/profile.controller.js";
import { getMe } from "../../controllers/user.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.get("/me", requireAuth, asyncHandler(getMe));
router.get("/me/profile", requireAuth, asyncHandler(getMyProfileDashboard));

export default router;
