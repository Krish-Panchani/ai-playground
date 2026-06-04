import { Router } from "express";

import { loginWithGoogle } from "../../controllers/auth.controller.js";
import { asyncHandler } from "../../utils/async-handler.js";

const router = Router();

router.post("/google", asyncHandler(loginWithGoogle));

export default router;
